const router = require('express').Router();
const requireAuthJson = require('../middleware/clerkAuth');

const { getHistory, getHistoryItem, deleteHistoryItem } = require('../controllers/historyController');

// GET /api/history — list the signed-in user's saved summaries
router.get('/', requireAuthJson, getHistory);

// GET /api/history/:id — full record (includes transcript + timestamps)
router.get('/:id', requireAuthJson, getHistoryItem);

// DELETE /api/history/:id — owner-scoped delete
router.delete('/:id', requireAuthJson, deleteHistoryItem);

module.exports = router;