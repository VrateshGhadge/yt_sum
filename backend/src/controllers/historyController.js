const { AiError } = require('../services/aiService');
const { listHistory, getHistoryRecord, deleteHistoryRecord } = require('../services/historyService');

async function getHistory(req, res, next) {
    try {
        const items = await listHistory(req.auth.userId, { limit: req.query.limit });
        return res.status(200).json({
            success: true,
            data: { items }
        });
    } catch (err) {
        if (err instanceof AiError) {
            return res.status(err.status).json({ success: false, message: err.message, code: err.code });
        }
        return next(err);
    }
}

async function getHistoryItem(req, res, next) {
    try {
        const record = await getHistoryRecord(req.auth.userId, req.params.id);
        return res.status(200).json({ success: true, data: record });
    } catch (err) {
        if (err instanceof AiError) {
            return res.status(err.status).json({ success: false, message: err.message, code: err.code });
        }
        return next(err);
    }
}

async function deleteHistoryItem(req, res, next) {
    try {
        await deleteHistoryRecord(req.auth.userId, req.params.id);
        return res.status(200).json({ success: true, message: 'Record deleted' });
    } catch (err) {
        if (err instanceof AiError) {
            return res.status(err.status).json({ success: false, message: err.message, code: err.code });
        }
        return next(err);
    }
}

module.exports = { getHistory, getHistoryItem, deleteHistoryItem };