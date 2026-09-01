const jwt = require('jsonwebtoken');

// ==========================================
// AUTH MIDDLEWARE
// ==========================================
// Verifies JWT from Authorization header
// Attaches decoded user to req.user
// ==========================================

const auth = (req, res, next) => {

    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {

        return res.status(401).json({
            error: 'Unauthorized',
            message: 'No token provided. Access denied.'
        });

    }

    const token = authHeader.split(' ')[1];

    try {

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();

    } catch (err) {

        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired token'
        });

    }

};

module.exports = auth;
