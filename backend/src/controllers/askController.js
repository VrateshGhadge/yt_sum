const { getAuth } = require('@clerk/express');
const { answerQuestion } = require('../services/qaService');
const { AiError } = require('../services/aiService');
const { extractVideoId, validateYouTubeUrl } = require('../utils/transcript');

async function askQuestion(req, res, next) {
    try {
        const { question, videoId, youtubeUrl } = req.body;

        if (!question || typeof question !== 'string' || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }

        let id = videoId;
        if (youtubeUrl) {
            if (!validateYouTubeUrl(youtubeUrl)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid YouTube URL"
                });
            }
            const extracted = extractVideoId(youtubeUrl);
            if (!extracted) {
                return res.status(400).json({
                    success: false,
                    message: "Unable to extract video ID"
                });
            }
            id = extracted;
        }

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Provide a videoId or a youtubeUrl"
            });
        }

        const { answer, citations } = await answerQuestion({ videoId: id, question: question.trim() });

        return res.status(200).json({
            success: true,
            data: {
                userId: getAuth(req).userId,
                videoId: id,
                question: question.trim(),
                answer,
                citations
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

module.exports = { askQuestion };