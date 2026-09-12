const mongoose = require('mongoose');
const { readCaptions } = require('../services/transcriptService');

/**
 * A probe for the deployed instance. Two things differ between a laptop and a
 * server and are invisible from the UI: whether the database is connected, and
 * whether this host can actually read YouTube captions (YouTube refuses some
 * datacentre addresses). It returns no user data and names no provider.
 *
 *   GET /api/health                      -> database only
 *   GET /api/health?video=<videoId>      -> also reads one video's captions
 */
async function getHealth(req, res) {
    const data = {
        // Which build is answering. Render exports the commit it deployed, so a
        // probe can tell "the fix did not work" from "the fix is not live yet".
        commit: (process.env.RENDER_GIT_COMMIT || '').slice(0, 7) || null,
        db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        captions: 'not-checked',
    };

    const videoId = typeof req.query.video === 'string' ? req.query.video.trim() : '';
    if (videoId) {
        const result = await readCaptions(videoId);
        data.captions = result.ok ? 'ok' : 'unavailable';
        data.reason = result.ok ? null : result.reason;
        data.track = result.ok ? result.track.languageCode : null;
        // Which route answered: the library, the library with a supplied key, or
        // the second Innertube client — the difference between a host YouTube
        // will talk to and one it will not.
        data.via = result.via || null;
        data.usedFallbackKey = Boolean(result.usedFallbackKey);
    }

    return res.status(200).json({ success: true, data });
}

module.exports = { getHealth };
