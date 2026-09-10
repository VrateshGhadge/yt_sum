const router = require('express').Router();
const requireAuthJson = require('../middleware/clerkAuth');

const { getQuiz } = require('../controllers/quizController');

// POST /api/quiz (protected via Clerk session)
// Body: { videoId, questionCount? } or { youtubeUrl, questionCount? }
router.post('/', requireAuthJson, getQuiz);

module.exports = router;