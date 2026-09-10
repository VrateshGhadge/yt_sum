const mongoose = require('mongoose');
const Transcript = require('../models/transcript');
const { AiError } = require('./aiService');

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

// Best-effort persistence: when the DB is down the summary request still
// succeeds, history is simply not recorded.
async function saveSummarizedVideo({ clerkId, videoId, videoUrl, title, author, durationMs, transcriptText, summary, summaryMode, segments }) {
    if (!dbReady()) return null;

    const record = await Transcript.findOneAndUpdate(
        { clerkId, videoId, summaryMode },
        {
            $set: {
                videoUrl,
                title,
                author,
                durationMs,
                transcriptText,
                summary,
                segments
            }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return record;
}

async function listHistory(clerkId, { limit = 50 } = {}) {
    requireDb();
    return Transcript.find({ clerkId })
        .sort({ createdAt: -1 })
        .limit(Math.min(Math.max(Number(limit) || 50, 1), 100))
        .lean();
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