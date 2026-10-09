const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware to verify JWT token and attach user to request
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Please login first' });
  }

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Middleware to restrict access based on user role
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}

module.exports = {
  authMiddleware,
  requireRole,
  SECRET
};
