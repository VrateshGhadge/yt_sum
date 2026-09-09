const router = require('express').Router();
const requireAuthJson = require('../middleware/clerkAuth');

const { askQuestion } = require('../controllers/askController');

// POST /api/ask (protected via Clerk session)
// Body: { question, videoId } or { question, youtubeUrl }
router.post('/', requireAuthJson, askQuestion);

module.exports = router;