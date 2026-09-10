const { getAuth } = require('@clerk/express');
const { getTranscriptData } = require('../services/transcriptService');
const { AiError, generateNotes } = require('../services/aiService');
const { getVideoTitle, resolveVideoId } = require('../utils/transcript');

async function getNotes(req, res, next) {
    try {
        const { videoId: id, error } = resolveVideoId(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        const transcriptData = await getTranscriptData(id);
        if (!transcriptData) {
            return res.status(404).json({
                success: false,
                message: "Transcript not available for this video - it may have captions disabled"
            });
        }

        const videoInfo = await getVideoTitle(id); // best-effort

        const { notes } = await generateNotes(transcriptData.text);

        return res.status(200).json({
            success: true,
            data: {
                userId: getAuth(req).userId,
                videoId: id,
                title: videoInfo?.title ?? null,
                author: videoInfo?.author ?? null,
                notes
            }
        });
    } catch (err) {
        if (err instanceof AiError) {
            return res.status(err.status).json({
                success: false,
                message: err.message,
                code: err.code
            });
        }
        return next(err);
    }
}

module.exports = { getNotes };