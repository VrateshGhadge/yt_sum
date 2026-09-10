const { chunkWithOverlap } = require('../utils/transcript');

// ---------------------------------------------------------------------------
// Env contract (defaults in parens)
//   OPENROUTER_API_KEY                   (required — free OpenRouter API key)
//   AI_MODEL          = "nvidia/nemotron-3.5-lightning:free"  (default free model)
//   AI_FALLBACK_MODEL = "openrouter/free"  (auto-router, retried when :free is rate-limited)
//
// Every AI call goes to OpenRouter free (`:free`) models only. No OpenAI, no
// billing, no other providers.
// ---------------------------------------------------------------------------

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const AI_MODEL = process.env.AI_MODEL || 'nvidia/nemotron-3.5-lightning:free';
const AI_FALLBACK_MODEL = process.env.AI_FALLBACK_MODEL || 'openrouter/free';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

class AiError extends Error {
  constructor(message, { status = 502, code = 'AI_ERROR' } = {}) {
    super(message);
    this.name = 'AiError';
    this.status = status;
    this.code = code;
  }
}

function toReadableError(err) {
  const rawMessage = err?.message || 'Unknown AI provider error';
  const status = typeof err?.status === 'number' ? err.status : 502;

  if (status === 429) {
    return new AiError(
      'Rate limited by the AI provider (free models have daily caps). Try again in a moment.',
      { status: 429, code: 'RATE_LIMITED' }
    );
  }
  if (status === 401) {
    return new AiError('Invalid AI API key.', { status: 502, code: 'INVALID_KEY' });
  }
  if (status >= 500) {
    return new AiError('The AI provider is temporarily unavailable. Please retry shortly.', {
      status: 502,
      code: 'PROVIDER_DOWN',
    });
  }
  return new AiError(rawMessage, { status, code: 'AI_ERROR' });
}

// OpenRouter `:free` model variants commonly return their chain-of-thought
// inside the answer content ("Here's a thinking process: ..."). Strip the
// reasoning preamble so downstream features get a clean answer.
function stripThinkingPreamble(content) {
  if (!content) return content;

  const marker = /Here'?s a thinking process:\s*/i;
  if (!marker.test(content)) return content.trim();

  let body = content.replace(marker, '').trim();

  // Reasoning steps are numbered markdown sections like "1.  **Label:**".
  // The actual answer follows the last such section.
  const sections = body.split(/\n(?=\d+\.\s+\*\*)/);
  if (sections.length > 1) {
    body = sections[sections.length - 1].trim();
  }

  // Drop a leading answer label ("Output:", "Final Answer:", ...) if present.
  body = body.replace(/^(?:Output|Final Answer|Answer|Response)\s*:\s*/i, '').trim();

  return body || content.trim();
}

async function postChatCompletion({ model, messages, temperature, maxTokens, timeoutMs }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'yt-sum',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new AiError('The AI request timed out. The transcript may be very long — try again.', {
        code: 'TIMEOUT',
      });
    }
    throw new AiError('Could not reach the AI provider. Check your network connection.', {
      code: 'NETWORK',
    });
  } finally {
    clearTimeout(timer);
  }

  const status = response.status;
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const err = new Error(body?.error?.message || body?.message || `AI provider error (${status})`);
    err.status = status;
    throw err;
  }

  const content = body?.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    throw new AiError('The AI returned an empty response.', { code: 'EMPTY_RESPONSE' });
  }
  return stripThinkingPreamble(content);
}

/**
 * Send a chat completion to an OpenRouter free model. Returns the assistant's
 * text content, or throws an AiError with a readable message.
 */
async function chatCompletion({
  system,
  messages = [],
  temperature = 0.3,
  maxTokens = 1024,
  timeoutMs = 120000,
}) {
  if (!OPENROUTER_API_KEY) {
    throw new AiError(
      'OPENROUTER_API_KEY is not set. Add it to backend/.env.local to use OpenRouter free models.',
      { status: 502, code: 'MISSING_KEY' }
    );
  }

  const payload = {
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages,
    ],
    temperature,
    maxTokens,
  };

  try {
    return await postChatCompletion({ model: AI_MODEL, timeoutMs, ...payload });
  } catch (err) {
    if (err instanceof AiError) throw err;

    // Free :free models get rate-limited / rotated often. Retry once via the
    // auto-router before giving up.
    const isRateLimit =
      err?.status === 429 || /rate limit|overloaded|temporarily unavailable/i.test(err?.message || '');
    if (isRateLimit) {
      try {
        return await postChatCompletion({ model: AI_FALLBACK_MODEL, timeoutMs, ...payload });
      } catch (retryErr) {
        if (retryErr instanceof AiError) throw retryErr;
      }
    }

    throw toReadableError(err);
  }
}

// Summary mode → prompt variation. Modes are pure prompt changes: no code
// paths, no extra dependencies, no extra cost beyond the single call.
const SUMMARY_MODES = {
  concise: {
    temperature: 0.3,
    instruction: 'Be concise and cover the main points.',
  },
  detailed: {
    temperature: 0.4,
    instruction: 'Write a detailed summary covering all the major points, supporting details, and conclusions.',
  },
  bullets: {
    temperature: 0.3,
    instruction: 'Present the summary as a list of bullet points covering the main points.',
  },
  keypoints: {
    temperature: 0.3,
    instruction: 'Present the summary as a numbered list of 5-10 key points.',
  },
};

const DEFAULT_SUMMARY_SYSTEM =
  'You summarize YouTube video transcripts. Respond with the summary only — no preamble, no markdown headers.';

function summarySystemFor(mode) {
  if (mode === 'bullets') {
    return 'You summarize YouTube video transcripts using bullet points only — no preamble, no markdown headers, no paragraphs.';
  }
  if (mode === 'keypoints') {
    return 'You summarize YouTube video transcripts as a numbered list of key points only — no preamble, no markdown headers, no paragraphs.';
  }
  return DEFAULT_SUMMARY_SYSTEM;
}

/**
 * Summarize a video transcript.
 * Default: single LLM call (free models have 1M-token contexts, so most
 * transcripts fit). Falls back to map-reduce for very long transcripts.
 * mode: "concise" | "detailed" | "bullets" | "keypoints" (default "concise")
 */
async function summarizeTranscript(text, { mode = 'concise', maxChunkChars = 100000, chunkChars = 50000, overlapChars = 2000 } = {}) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new AiError('No transcript provided to summarize.', { code: 'NO_INPUT' });
  }

  const config = SUMMARY_MODES[mode];
  if (!config) {
    throw new AiError(
      `Invalid summary mode "${mode}". Use one of: ${Object.keys(SUMMARY_MODES).join(', ')}.`,
      { code: 'BAD_MODE' }
    );
  }

  const system = summarySystemFor(mode);
  const { instruction, temperature } = config;

  // Free reasoning models emit their chain of thought inside the content, so the
  // token budget must cover BOTH the reasoning and the answer — too small a
  // budget yields truncated reasoning instead of a summary.
  const singleShotBudget = mode === 'detailed' ? 3500 : 2500;

  // Single shot when it fits.
  if (text.length <= maxChunkChars) {
    const summary = await chatCompletion({
      system,
      messages: [
        {
          role: 'user',
          content: `Summarize the following video transcript. ${instruction}\n\n${text}`,
        },
      ],
      temperature,
      maxTokens: singleShotBudget,
    });
    return { summary };
  }

  // Map-reduce for very long transcripts.
  const chunks = chunkWithOverlap(text, chunkChars, overlapChars);
  const excerptSummaries = [];
  for (const chunk of chunks) {
    const s = await chatCompletion({
      system,
      messages: [
        { role: 'user', content: `Summarize this transcript excerpt in 2-3 sentences.\n\n${chunk}` },
      ],
      maxTokens: 900,
      temperature,
    });
    excerptSummaries.push(s);
  }

  const combined = await chatCompletion({
    system,
    messages: [
      {
        role: 'user',
        content: `Combine these excerpt summaries into one cohesive summary of the whole video. ${instruction}\n\n${excerptSummaries.join('\n\n')}`,
      },
    ],
    temperature,
    maxTokens: singleShotBudget,
  });

  return { summary: combined };
}

// Robust JSON extraction from model output: trims fences (```json), finds the
// outermost object, and parses it. Throws AiError on failure.
function parseJson(content) {
  if (!content || typeof content !== 'string') {
    throw new AiError('The AI returned non-text output.', { code: 'BAD_RESPONSE' });
  }

  let str = content.trim();
  const fenced = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) str = fenced[1].trim();

  const start = str.indexOf('{');
  const end = str.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new AiError('The AI output contained no JSON object.', { code: 'BAD_RESPONSE' });
  }

  try {
    return JSON.parse(str.slice(start, end + 1));
  } catch {
    throw new AiError('The AI returned invalid JSON.', { code: 'BAD_RESPONSE' });
  }
}

// Very long transcripts are condensed via the (map-reduce) summarizer first so
// notes/quiz generation stays within a single prompt.
const GENERATION_MAX_CHARS = 100000;

async function condenseForGeneration(text) {
  if (text.length <= GENERATION_MAX_CHARS) return text;
  const { summary } = await summarizeTranscript(text, { mode: 'detailed' });
  return summary;
}

/**
 * Generate bullet-point study notes from a transcript.
 * Returns { notes } (markdown bullet string).
 */
async function generateNotes(text) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new AiError('No transcript provided for notes.', { code: 'NO_INPUT' });
  }

  const source = await condenseForGeneration(text);

  const notes = await chatCompletion({
    system:
      'You create concise, well-organized study notes from a YouTube video transcript. ' +
      'Use bullet points grouped under clear headings. Cover key concepts, definitions, and takeaways. ' +
      'Respond with the notes only — no preamble.',
    messages: [
      { role: 'user', content: `Create study notes for this transcript:\n\n${source}` },
    ],
    temperature: 0.3,
    maxTokens: 2500,
  });

  return { notes };
}

/**
 * Generate quiz questions from a transcript.
 * Returns { questions: [{ question, options[], answerIndex, explanation }] }.
 */
async function generateQuiz(text, count) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new AiError('No transcript provided for quiz generation.', { code: 'NO_INPUT' });
  }

  const desired = Math.min(Math.max(Number(count) || 5, 1), 10);
  const source = await condenseForGeneration(text);

  const raw = await chatCompletion({
    system:
      'You create quiz questions from a YouTube video transcript. ' +
      'Respond with RAW JSON only, matching exactly this schema: ' +
      '{"questions":[{"question":"...","options":["...","...","...","..."],"answerIndex":0,"explanation":"..."}]}. ' +
      `Answer with exactly ${desired} questions. answerIndex is the 0-based index of the correct option. ` +
      'options must have exactly 4 items. explanation briefly justifies the answer using the transcript.',
    messages: [
      { role: 'user', content: `Create ${desired} quiz questions from this transcript:\n\n${source}` },
    ],
    temperature: 0.4,
    maxTokens: 2500,
  });

  const parsed = parseJson(raw);
  const rawQuestions = Array.isArray(parsed?.questions) ? parsed.questions : null;
  if (!rawQuestions || rawQuestions.length === 0) {
    throw new AiError('The AI returned no quiz questions.', { code: 'BAD_RESPONSE' });
  }

  const questions = rawQuestions
    .filter(
      (q) =>
        q &&
        typeof q.question === 'string' &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        Number.isInteger(q.answerIndex) &&
        q.answerIndex >= 0 &&
        q.answerIndex < q.options.length &&
        typeof q.explanation === 'string'
    )
    .map((q) => ({
      question: q.question.trim(),
      options: q.options.map((o) => String(o).trim()),
      answerIndex: q.answerIndex,
      explanation: q.explanation.trim(),
    }))
    .slice(0, desired);

  if (questions.length === 0) {
    throw new AiError('The AI returned malformed quiz questions.', { code: 'BAD_RESPONSE' });
  }

  return { questions };
}

module.exports = { AiError, chatCompletion, generateNotes, generateQuiz, parseJson, summarizeTranscript };