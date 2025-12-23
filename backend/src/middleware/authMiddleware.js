const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');

dotenv.config();

function authMiddleware(req, res, next){
    const authHeader = req.headers['authorization'];//can also written -> req.header('authorization')
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({msg:"Token not provided"})
    }

    try{ 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({msg:"Invalid token"})
    }
}

module.exports = authMiddleware

