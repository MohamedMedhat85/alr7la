const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    let token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'missing token' });
    }

    // Remove extra quotes if they exist around the token
    token = token.replace(/^"(.*)"$/, '$1');

    try {
        const decoded = jwt.verify(token, 'moot_2025');
        if (decoded.role  ===  'admin') {
            req.user = decoded;
            next(); // Proceed to the next middleware or route handler
        }
        else {
            return res.status(403).json({ message: 'You are not an admin' });
        }

    } catch (err) {
        return res.status(403).json({ message: 'Token verification failed' });
    }
};

module.exports = authenticateToken;