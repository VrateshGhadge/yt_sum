const { getTranscriptData } = require('../services/transcriptService');
const { AiError, generateQuiz } = require('../services/aiService');
const { getVideoTitle, resolveVideoId } = require('../utils/transcript');

async function getQuiz(req, res, next) {
    try {
        const { videoId: id, error } = resolveVideoId(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error });
        }

        const questionCount = Math.min(Math.max(Number(req.body.questionCount) || 5, 1), 10);

        const transcriptData = await getTranscriptData(id);
        if (!transcriptData) {
            return res.status(404).json({
                success: false,
                message: "Transcript not available for this video - it may have captions disabled"
            });
        }

        const videoInfo = await getVideoTitle(id); // best-effort

        const { questions } = await generateQuiz(transcriptData.text, questionCount);

        return res.status(200).json({
            success: true,
            data: {
                userId: req.auth.userId,
                videoId: id,
                title: videoInfo?.title ?? null,
                author: videoInfo?.author ?? null,
                questionCount: questions.length,
                questions
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

module.exports = { getQuiz };