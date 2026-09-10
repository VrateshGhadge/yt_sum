const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TranscriptSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        default: null
    },
    author: {
        type: String,
        default: null
    },
    videoId: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        default: null
    },
    durationMs: {
        type: Number,
        default: null
    },
    summaryMode: {
        type: String,
        default: 'concise'
    },
    transcriptText: {
        type: String,
        default: null
    },
    summary: {
        type: String,
        default: null
    },
    segments: [{
        text: String,
        offsetMs: Number,
        durationMs: Number
    }]

}, { timestamps: true });

// One entry per (user, video) — re-summarizing with any mode refreshes it.
TranscriptSchema.index({ clerkId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('Transcript', TranscriptSchema);