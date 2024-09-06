const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate using the token sent in headers
const authMiddleware = async (req, res, next) => {
    // Get the token from the request headers
    const token = req.header('x-auth-token');

    // If no token is provided, return an error
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token using the same secret you used when generating it
        const decoded = jwt.verify(token, 'secretToken'); // Use the same secret you used in login/signup

        // Fetch the user from the decoded payload
        req.user = await User.findById(decoded.user.id).select('-password');

        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // If token verification fails, return an error
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
