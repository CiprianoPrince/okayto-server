const db = require('../models');
const User = db.User;
const RefreshToken = db.RefreshToken;

const { StatusCodes } = require('http-status-codes');

const { sendResponse, generateMessage } = require('../helpers');
exports.handleLogout = async (req, res) => {
    try {
        // Extract JWT token from the cookies
        const existingRefreshToken = req.cookies.jwt;

        if (!existingRefreshToken) {
            return sendResponse(res, StatusCodes.UNAUTHORIZED, generateMessage.logout.fail());
        }

        // Find user with the corresponding refreshToken
        const foundUser = await User.findOne({
            include: {
                model: RefreshToken,
                where: { token: existingRefreshToken },
            },
        });

        // If a user with the refreshToken is found, delete the token
        if (foundUser) {
            await RefreshToken.destroy({ where: { token: existingRefreshToken } });
        }

        // Clear the JWT cookie
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });
        console.log('success logout');
        sendResponse(res, StatusCodes.NO_CONTENT, generateMessage.logout.success());
    } catch (error) {
        if (error instanceof ValidationError) {
            // handle validation error
        }

        sendResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            generateMessage.logout.error(),
            null,
            error,
            'ERR9001'
        );
    }
};
