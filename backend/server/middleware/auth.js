const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'car-rental-secret-key';

// Verify token on protected routes
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
}

// Check if user is an Administrator
function adminOnly(req, res, next) {
    if (req.user.role !== 'Administrator') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
}

module.exports = { verifyToken, adminOnly, JWT_SECRET };
