const { chunkWithOverlap } = require('../utils/transcript');

// ---------------------------------------------------------------------------
// Env contract (defaults in parens)
//   OPENROUTER_API_KEY                   (required — free OpenRouter API key)
//   AI_MODEL          = "nvidia/nemotron-3.5-lightning:free"  (default free model)
//   AI_FALLBACK_MODEL = "openrouter/free"  (auto-router, retried when :free is rate-limited)
//   AI_RETRY_ATTEMPTS = 3      (retries per model while rate-limited)
//   AI_RETRY_BASE_MS  = 800    (first backoff step; doubles each attempt)
//   AI_RETRY_MAX_MS   = 6000   (longest wait; a longer Retry-After moves on)
//
// Every AI call goes to OpenRouter free (`:free`) models only. No OpenAI, no
// billing, no other providers.
// ---------------------------------------------------------------------------

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const AI_MODEL = process.env.AI_MODEL || 'nvidia/nemotron-3.5-lightning:free';
const AI_FALLBACK_MODEL = process.env.AI_FALLBACK_MODEL || 'openrouter/free';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const RETRY_ATTEMPTS = Number(process.env.AI_RETRY_ATTEMPTS) || 3;
const RETRY_BASE_MS = Number(process.env.AI_RETRY_BASE_MS) || 800;
const RETRY_MAX_MS = Number(process.env.AI_RETRY_MAX_MS) || 6000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Free-tier caps clear on a short window, so a rate limit usually succeeds after
// a brief wait — retrying immediately just hits the same cap. Steps double and
// carry jitter, so requests that were made together do not retry in lockstep.
function backoffMs(attempt) {
  const base = Math.min(RETRY_BASE_MS * 2 ** attempt, RETRY_MAX_MS);
  return Math.round(base * (0.7 + Math.random() * 0.6));
}

// Retry-After is authoritative when present: seconds, or an HTTP date.
function retryAfterMs(err) {
  const raw = err?.retryAfter;
  if (!raw) return null;
  const seconds = Number(raw);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(raw);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : null;
}

// X-RateLimit-Reset is a unix timestamp in milliseconds.
function resetAtMs(err) {
  const raw = Number(err?.rateLimitReset);
  return Number.isFinite(raw) && raw > 0 ? raw : null;
}

// When the window resets, as a short local time. The reset is at a fixed moment,
// so naming it is more useful than telling someone to try again "in a moment"
// and letting them discover otherwise.
function formatReset(resetAt) {
  const time = new Date(resetAt).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  const hoursAway = (resetAt - Date.now()) / 3600000;
  if (hoursAway < 1) return `It resets at ${time}.`;
  const day = new Date(resetAt).toLocaleDateString(undefined, { weekday: 'long' });
  return `It resets at ${time} on ${day}.`;
}

// Names the cap that was actually hit, so the message is not a generic
// "rate limited" for two very different situations.
function rateLimitError(err) {
  const resetAt = resetAtMs(err);
  const when = resetAt ? ' ' + formatReset(resetAt) : ' Try again shortly.';
  const perDay = err?.rateLimitSource === 'openrouter_free_tier_daily';
  const count = err?.rateLimitLimit ? ` (${err.rateLimitLimit} requests)` : '';

  return new AiError(
    perDay
      ? `The free model daily limit${count} is used up for today.${when}`
      : `The model is rate-limited right now.${when}`,
    { status: 429, code: 'RATE_LIMITED' }
  );
}

// Free models here are reasoning models: left on, they spend the ENTIRE token
// budget on hidden chain-of-thought and return a truncated fragment (measured:
// 663 of 700 tokens), which made every answer both slow and wrong. Turning
// reasoning off cut a bullets summary 35s -> 10s and a quiz from minutes to ~8s,
// with correct output. AI_REASONING=on restores the default behaviour.
const DISABLE_REASONING = (process.env.AI_REASONING || 'off').toLowerCase() !== 'on';

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
        ...(DISABLE_REASONING ? { reasoning: { enabled: false } } : {}),
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
    err.retryAfter = response.headers.get('retry-after');
    // Which limit was hit, and when the window resets. A per-minute cap clears
    // while this request is in flight; the free tier's daily cap resets hours
    // later, so waiting cannot succeed and only spends quota.
    err.rateLimitReset = response.headers.get('x-ratelimit-reset');
    err.rateLimitLimit = response.headers.get('x-ratelimit-limit');
    err.rateLimitSource = body?.error?.metadata?.limit_source || null;
    throw err;
  }

  const content = body?.choices?.[0]?.message?.content;
  if (!content || !content.trim()) {
    throw new AiError('The AI returned an empty response.', { code: 'EMPTY_RESPONSE' });
  }
  return stripThinkingPreamble(content);
}

// A model is worth retrying when the provider is throttling it or it did not
// answer in time. The message test catches providers that report a rate limit
// with a non-429 status.
function isRetryable(err) {
  return (
    err?.status === 429 ||
    err?.code === 'TIMEOUT' ||
    /rate limit|overloaded|temporarily unavailable|timed out/i.test(err?.message || '')
  );
}

/**
 * Run one model, waiting out rate limits. Returns the content, or the last
 * error plus whether another model is worth trying.
 */
async function attemptModel(model, payload) {
  let lastError;
  let accountCap = false;

  for (let attempt = 0; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      return { ok: true, content: await postChatCompletion({ model, ...payload }) };
    } catch (err) {
      lastError = err;

      // Only a rate limit is worth waiting on: a timeout has already spent the
      // whole timeout budget, so the next model is the better bet.
      if (err?.status !== 429) break;

      // A free-tier cap is charged against the whole account, so no other free
      // model can serve this request. Switching would only spend another one.
      if (/free_tier/i.test(err?.rateLimitSource || '')) accountCap = true;

      // How long until the window clears — the provider's own answer if it gave
      // one, otherwise the reset moment it reported.
      const untilReset = resetAtMs(err) ? Math.max(0, resetAtMs(err) - Date.now()) : null;
      const wait = retryAfterMs(err) ?? untilReset;

      // A window that outlasts our patience cannot be retried into succeeding,
      // so stop waiting on this model. Whether another model is worth trying is
      // a separate question, answered below.
      if (wait !== null && wait > RETRY_MAX_MS) break;

      if (attempt === RETRY_ATTEMPTS) break;

      const delay = wait ?? backoffMs(attempt);
      console.warn(`[ai] ${model} rate-limited, retrying in ${Math.round(delay)}ms (attempt ${attempt + 1}/${RETRY_ATTEMPTS})`);
      await sleep(delay);
    }
  }

  return {
    ok: false,
    error: lastError,
    tryNextModel: isRetryable(lastError) && !accountCap,
  };
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
  // Free-tier latency is highly variable: identical requests measured between
  // 13s and 84s depending on provider congestion. A 30s ceiling marks a model as
  // congested early enough to try another one, instead of hanging the UI.
  timeoutMs = Number(process.env.AI_TIMEOUT_MS) || 30000,
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
    timeoutMs,
  };

  // The primary model first, then the auto-router, which picks whatever has
  // capacity — turning a likely rate limit into a likely success.
  let lastError;
  for (const model of [AI_MODEL, AI_FALLBACK_MODEL]) {
    const result = await attemptModel(model, payload);
    if (result.ok) return result.content;

    lastError = result.error;
    if (!result.tryNextModel) break;
  }

  // A rate limit gets the provider's own reset time rather than a generic
  // "try again in a moment", which is misleading when the cap is daily.
  if (lastError?.status === 429) throw rateLimitError(lastError);
  throw lastError instanceof AiError ? lastError : toReadableError(lastError);
}

// Summary mode → prompt + budget. Each mode has a hard length the model is told
// to respect, and a token budget matched to it so a short mode cannot ramble.
const SUMMARY_MODES = {
  concise: {
    temperature: 0.3,
    maxTokens: 450,
    instruction:
      'Write ONE paragraph of at most 120 words. Plain prose, no headings, no bullets. Cover only the main points.',
  },
  detailed: {
    temperature: 0.4,
    maxTokens: 1100,
    instruction:
      'Write at most 350 words across a few short paragraphs. Cover the major points, supporting detail, and conclusions. No headings, no bullets.',
  },
  bullets: {
    temperature: 0.3,
    maxTokens: 450,
    instruction:
      'Write between 5 and 8 bullet points. EXACTLY one bullet per line, each line starting with "- ". '
      + 'Each bullet is at most 20 words. No headings, no blank lines, no paragraphs.',
  },
  keypoints: {
    temperature: 0.3,
    maxTokens: 450,
    instruction:
      'Write exactly 7 key points as a numbered list. EXACTLY one point per line, each line starting with "1. ", "2. " and so on. '
      + 'Each point is at most 20 words. No headings, no blank lines, no paragraphs.',
  },
};

const DEFAULT_SUMMARY_SYSTEM =
  'You summarize YouTube video transcripts. Follow the length limit exactly. '
  + 'Respond with the summary only — no preamble, no thinking, no explanation of your process.';

function summarySystemFor(mode) {
  if (mode === 'bullets') {
    return 'You summarize YouTube video transcripts as bullet points. '
      + 'One bullet per line, every line starting with "- ". Never put two bullets on one line. '
      + 'No preamble, no headings, no paragraphs.';
  }
  if (mode === 'keypoints') {
    return 'You summarize YouTube video transcripts as a numbered list. '
      + 'One numbered point per line. Never put two points on one line. '
      + 'No preamble, no headings, no paragraphs.';
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
  const { instruction, temperature, maxTokens } = config;

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
      maxTokens,
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
      maxTokens: 300,
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
    maxTokens,
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
      'Use short headings and bullet points. One bullet per line, each starting with "- ". ' +
      'At most 250 words total. Respond with the notes only — no preamble, no thinking.',
    messages: [
      { role: 'user', content: `Create study notes for this transcript:\n\n${source}` },
    ],
    temperature: 0.3,
    maxTokens: 800,
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
      'options must have exactly 4 items. Keep the explanation under 25 words. ' +
      'No preamble, no thinking, no text outside the JSON object.',
    messages: [
      { role: 'user', content: `Create ${desired} quiz questions from this transcript:\n\n${source}` },
    ],
    temperature: 0.4,
    maxTokens: 900,
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