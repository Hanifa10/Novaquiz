const jwt = require('jsonwebtoken');


const authMiddleware = (req, res, next) => {
    console.log('[AUTH MIDDLEWARE]', req.method, req.path, 'Authorization:', req.headers.authorization ? 'YES' : 'NO');
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send("Token manquant");

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch(error) {
        return res.status(403).send("Token invalide");
    }
    
};

module.exports = authMiddleware;