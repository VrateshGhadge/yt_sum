const { getTranscriptData } = require('../services/transcriptService');
const { AiError, summarizeTranscript } = require('../services/aiService');
const { saveSummarizedVideo } = require('../services/historyService');
const { extractVideoId, getVideoTitle, validateYouTubeUrl } = require('../utils/transcript');

const VALID_MODES = ['concise', 'detailed', 'bullets', 'keypoints'];

async function getSummary(req, res, next) {
    try {
        const { youtubeUrl, mode = 'concise', includeTranscript = false } = req.body;

        if (!youtubeUrl) {
            return res.status(400).json({
                success: false,
                message: "YouTube URL not found"
            });
        }

        if (!validateYouTubeUrl(youtubeUrl)) {
            return res.status(400).json({
                success: false,
                message: "Invalid YouTube URL"
            });
        }

        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            return res.status(400).json({
                success: false,
                message: "Unable to extract video ID"
            });
        }

        if (!VALID_MODES.includes(mode)) {
            return res.status(400).json({
                success: false,
                message: `Invalid summary mode "${mode}". Use one of: ${VALID_MODES.join(', ')}.`
            });
        }

        const transcriptData = await getTranscriptData(videoId);
        if (!transcriptData) {
            return res.status(404).json({
                success: false,
                message: "Transcript not available for this video - it may have captions disabled"
            });
        }

        const videoInfo = await getVideoTitle(videoId); // { title, author } | null (best-effort)

        const { summary } = await summarizeTranscript(transcriptData.text, { mode });

        // Persist to the user's history (best-effort — skipped when DB is down).
        const durationMs = transcriptData.segments.length
            ? Math.max(...transcriptData.segments.map((s) => (s.offsetMs || 0) + (s.durationMs || 0)))
            : null;
        let historyId = null;
        try {
            const record = await saveSummarizedVideo({
                clerkId: req.auth.userId,
                videoId,
                videoUrl: youtubeUrl,
                title: videoInfo?.title ?? null,
                author: videoInfo?.author ?? null,
                durationMs,
                transcriptText: transcriptData.text,
                summary,
                summaryMode: mode,
                segments: transcriptData.segments,
            });
            historyId = record?._id ? String(record._id) : null;
        } catch (persistErr) {
            console.warn('[history] failed to persist summary:', persistErr?.message);
        }

        const data = {
            userId: req.auth.userId,
            historyId,
            videoId,
            title: videoInfo?.title ?? null,
            author: videoInfo?.author ?? null,
            mode,
            summary
        };

        const wantTranscript = includeTranscript === true || includeTranscript === 'true';
        if (wantTranscript) {
            data.transcript = transcriptData.text;
            data.timestamps = transcriptData.segments;
        }

        return res.status(200).json({
            success: true,
            data
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

module.exports = { getSummary };