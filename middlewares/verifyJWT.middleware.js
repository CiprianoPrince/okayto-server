require('dotenv').config();
const jwt = require('jsonwebtoken');
const { sendResponse, generateMessage } = require('../helpers');
const { StatusCodes } = require('http-status-codes');

module.exports = (req, res, next) => {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    // Check if authHeader exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendResponse(
            res,
            StatusCodes.UNAUTHORIZED,
            generateMessage.verifyToken.unauthorized()
        );
    }

    // Extract token from authHeader
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return sendResponse(
                res,
                StatusCodes.FORBIDDEN,
                generateMessage.verifyToken.forbidden()
            );
        }

        console.log(decoded);

        // Assign user information to the req object
        req.userId = decoded.userId;
        req.role = decoded.role;
        next(); // Proceed to the next middleware or route handler
    });
};
