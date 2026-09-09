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
      maxTokens: 512,
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
  });

  return { summary: combined };
}

module.exports = { AiError, chatCompletion, summarizeTranscript };