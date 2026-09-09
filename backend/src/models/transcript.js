const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TranscriptSchema = new Schema({
    title: {
        type: String
    },

    user: {
        // Clerk userId (user_xxx) of the authenticated user
        type: String,
    },

    // transcript_url: {  [ADD LATER]
    //     type: String,
    //     required: true
    // },

    videoId: {
        type: String,
    },

    videoUrl: {
        type: String,
    },

    duration: {
        type: Number,
    }

}, { timestamps: true });

module.exports = mongoose.model('Transcript', TranscriptSchema);
