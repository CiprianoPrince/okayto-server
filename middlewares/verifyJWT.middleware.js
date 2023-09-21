const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    // Check if authHeader exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendStatus(401); // Unauthorized
    }

    // Extract token from authHeader
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.sendStatus(403); // Forbidden due to invalid token
        }

        // Assign user information to the req object
        req.userId = decoded.userInfo.userId;
        req.role = decoded.userInfo.role;
        next(); // Proceed to the next middleware or route handler
    });
};
