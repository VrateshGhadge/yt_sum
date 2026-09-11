const { AiError, chatCompletion } = require('./aiService');
const { getTranscriptData } = require('./transcriptService');
const { chunkPassages, formatTimecode } = require('../utils/transcript');

// Common English stopwords — ignored when scoring passages against a question.
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'then', 'else', 'for', 'of', 'to',
  'in', 'on', 'at', 'by', 'with', 'about', 'as', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'do', 'does', 'did', 'have', 'has', 'had', 'will', 'would',
  'can', 'could', 'should', 'may', 'might', 'must', 'what', 'when', 'where',
  'which', 'who', 'whom', 'whose', 'this', 'that', 'these', 'those', 'how', 'why',
  'from', 'up', 'down', 'out', 'over', 'under', 'again', 'further', 'once', 'here',
  'there', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
  'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
  'just', 'because', 'while', 'into', 'through', 'during', 'before', 'after',
]);

function tokenize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function scorePassage(passageText, queryTokens) {
  const freq = new Map();
  for (const word of tokenize(passageText)) {
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  let score = 0;
  for (const token of queryTokens) {
    if (!STOPWORDS.has(token)) {
      score += freq.get(token) || 0;
    }
  }
  return score;
}

/**
 * Answer a question about a video using only its transcript.
 * RAG-lite: group segments into timed passages, score them against the
 * question, feed the top-k into the OpenRouter free model, and return the
 * answer with timestamp citations.
 */
async function answerQuestion({ videoId, question, topK = 3, maxPassageChars = 2500 }) {
  if (!videoId) {
    throw new AiError('videoId is required (or provide youtubeUrl).', { status: 400, code: 'MISSING_INPUT' });
  }
  if (!question || typeof question !== 'string' || !question.trim()) {
    throw new AiError('question is required.', { status: 400, code: 'MISSING_INPUT' });
  }

  const transcriptData = await getTranscriptData(videoId);
  if (!transcriptData) {
    throw new AiError('Transcript not available for this video - it may have captions disabled.', {
      status: 404,
      code: 'NO_TRANSCRIPT',
    });
  }

  const passages = chunkPassages(transcriptData.segments, maxPassageChars);
  if (passages.length === 0) {
    throw new AiError('Transcript is too short to answer questions about.', { status: 404, code: 'NO_CONTENT' });
  }

  const queryTokens = tokenize(question);
  const ranked = passages
    .map((passage, index) => ({ passage, index, score: scorePassage(passage.text, queryTokens) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, topK);

  // Citations: the spans of the retrieved passages (deduped, in reading order).
  const citations = ranked
    .slice()
    .sort((a, b) => a.passage.startMs - b.passage.startMs)
    .map(({ passage, index }) => ({
      index,
      text: passage.text,
      startMs: passage.startMs,
      endMs: passage.endMs,
      timecode: formatTimecode(passage.startMs),
    }));

  const excerpts = ranked
    .map(({ passage, index }) => `[Excerpt ${index + 1} - ${formatTimecode(passage.startMs)}]\n${passage.text}`)
    .join('\n\n');

  const answer = await chatCompletion({
    system:
      'You answer questions about a YouTube video using ONLY the transcript excerpts provided. ' +
      'At most 80 words. If the excerpts do not cover it, say so plainly. ' +
      'Respond with the answer only — no preamble, no thinking, no restating the question.',
    messages: [
      {
        role: 'user',
        content: `Question: ${question.trim()}\n\nTranscript excerpts:\n${excerpts}`,
      },
    ],
    temperature: 0.2,
    maxTokens: 350,
  });

  return { answer, citations };
}

module.exports = { answerQuestion };