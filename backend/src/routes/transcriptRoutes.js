const router = require('express').Router();
const requireAuthJson = require('../middleware/clerkAuth');

const { getTranscript } = require('../controllers/transcriptController');

// POST /api/transcript (protected via Clerk session)
router.post('/', requireAuthJson, getTranscript);

module.exports = router;
