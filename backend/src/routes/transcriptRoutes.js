const router = require('express').Router();

const { getTranscript } = require('../controllers/transcriptController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/transcript
router.post('/', authMiddleware, getTranscript);

module.exports = router;
