const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  let authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ message: 'missing token' });
  }
  let token = authHeader.split(' ')[1];
  // Remove extra quotes if they exist around the token
  token = token.replace(/^"(.*)"$/, '$1');

  try {
    const decoded = jwt.verify(token, 'alr7la_el7lwa');
    req.user = decoded; // Attach the decoded user information to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    return res.status(403).json({ message: 'Token verification failed' });
  }
};

// New middleware that optionally decodes the token if present
const optionalAuth = (req, res, next) => {
  let authHeader = req.headers['authorization'];

  if (!authHeader) {
    req.user = null;
    return next();
  }

  let token = authHeader.split(' ')[1];
  token = token.replace(/^"(.*)"$/, '$1');

  try {
    const decoded = jwt.verify(token, 'alr7la_el7lwa');
    req.user = decoded; // Attach the decoded user information to the request object
  } catch (err) {
    req.user = null;
  }
  next();
};

module.exports = { authenticateToken, optionalAuth };
