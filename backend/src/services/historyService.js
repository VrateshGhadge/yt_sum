const mongoose = require('mongoose');
const Transcript = require('../models/transcript');
const { AiError } = require('./aiService');
const { DEFAULT_PARAGRAPH_MS, mergeSegmentsByDuration } = require('../utils/transcript');

function dbReady() {
    return mongoose.connection.readyState === 1;
}

function requireDb() {
    if (!dbReady()) {
        throw new AiError(
            'Database is not connected. Set MONGO_URL to use history.',
            { status: 503, code: 'DB_UNAVAILABLE' }
        );
    }
}

// One record per (user, video): re-summarizing with a different mode updates
// the same entry rather than creating a duplicate.
async function saveSummarizedVideo({ clerkId, videoId, videoUrl, title, author, durationMs, transcriptText, summary, summaryMode, segments }) {
    if (!dbReady()) return null;

    const record = await Transcript.findOneAndUpdate(
        { clerkId, videoId },
        {
            $set: {
                videoUrl,
                title,
                author,
                durationMs,
                transcriptText,
                summary,
                summaryMode,
                segments
            }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return record;
}

async function listHistory(clerkId, { limit = 50 } = {}) {
    requireDb();
    // Exclude heavy fields (transcriptText, segments) — the list only needs
    // metadata; the full record is fetched per-item via getHistoryRecord.
    // segmentCount is computed server-side so the card can show how much
    // transcript a video has without shipping the fragments themselves.
    return Transcript.aggregate([
        { $match: { clerkId } },
        { $sort: { createdAt: -1 } },
        { $limit: Math.min(Math.max(Number(limit) || 50, 1), 100) },
        {
            $project: {
                videoId: 1,
                videoUrl: 1,
                title: 1,
                author: 1,
                summaryMode: 1,
                summary: 1,
                durationMs: 1,
                createdAt: 1,
                updatedAt: 1,
                segmentCount: { $size: { $ifNull: ['$segments', []] } },
            },
        },
    ]);
}

async function getHistoryRecord(clerkId, id) {
    requireDb();
    if (!id) {
        throw new AiError('History id is required.', { status: 400, code: 'MISSING_INPUT' });
    }
    const record = await Transcript.findOne({ _id: id, clerkId }).lean();
    if (!record) {
        throw new AiError('History record not found.', { status: 404, code: 'NOT_FOUND' });
    }

    // Records saved before paragraph grouping hold raw ~2s caption lines —
    // grouping on read (idempotent) keeps them consistent with new ones.
    if (Array.isArray(record.segments) && record.segments.length > 0) {
        record.segments = mergeSegmentsByDuration(record.segments, DEFAULT_PARAGRAPH_MS);
    }

    return record;
}

async function deleteHistoryRecord(clerkId, id) {
    requireDb();
    if (!id) {
        throw new AiError('History id is required.', { status: 400, code: 'MISSING_INPUT' });
    }
    const deleted = await Transcript.findOneAndDelete({ _id: id, clerkId }).lean();
    if (!deleted) {
        throw new AiError('History record not found.', { status: 404, code: 'NOT_FOUND' });
    }
    return deleted;
}

module.exports = { dbReady, saveSummarizedVideo, listHistory, getHistoryRecord, deleteHistoryRecord };