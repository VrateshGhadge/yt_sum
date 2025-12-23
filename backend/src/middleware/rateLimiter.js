const rateLimit = require('express-rate-limit')

const safeRetryAfter = (req) => {
  const reset = req?.rateLimit?.resetTime;
  if (!reset || isNaN(reset)) return null;
  return Math.ceil((reset - Date.now()) / 1000);
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  ipv6Subnet: 56, // optional
  handler: (req, res, next) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests — please try again later.',
      retryAfter: safeRetryAfter(req)
    });
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Try again later.'
    });
  },
});

module.exports = { globalLimiter , authLimiter };
