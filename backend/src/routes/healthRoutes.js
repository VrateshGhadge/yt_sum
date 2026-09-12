const router = require('express').Router();

const { getHealth } = require('../controllers/healthController');

// GET /api/health (public by design: it is a probe, and it carries no user data)
router.get('/', getHealth);

module.exports = router;
