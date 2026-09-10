const router = require('express').Router();
const requireAuthJson = require('../middleware/clerkAuth');

const { getNotes } = require('../controllers/notesController');

// POST /api/notes (protected via Clerk session)
// Body: { videoId } or { youtubeUrl }
router.post('/', requireAuthJson, getNotes);

module.exports = router;