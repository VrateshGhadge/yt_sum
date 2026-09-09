const { getAuth } = require('@clerk/express');

// Clerk session guard for JSON APIs. Unlike requireAuth() (which redirects
// browser requests), this always answers 401 with a JSON body.
function requireAuthJson(req, res, next) {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized - a valid Clerk session token is required'
        });
    }

    next();
}

module.exports = requireAuthJson;