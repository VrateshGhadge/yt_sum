const router = require('express').Router();
const requireAuthJson = require('../middleware/clerkAuth');

const { getSummary } = require('../controllers/summaryController');

// POST /api/summary (protected via Clerk session)
router.post('/', requireAuthJson, getSummary);

module.exports = router;