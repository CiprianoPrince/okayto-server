const db = require('../models');
const User = db.User;
const RefreshToken = db.RefreshToken;

const jwt = require('jsonwebtoken');

const { StatusCodes } = require('http-status-codes');

const { sendResponse, generateMessage } = require('../helpers');

exports.handleRefreshToken = async (req, res) => {
    try {
        // Extract JWT token from the cookies
        const existingToken = req.cookies?.jwt;

        // If no JWT token is present in the cookies, return a 401 Unauthorized status
        if (!existingToken) {
            return sendResponse(res, StatusCodes.UNAUTHORIZED, generateMessage.refresh.noCookie());
        }

        // Clear the JWT cookie
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

        // Fetch the user associated with the given refresh token
        const foundUser = await User.findOne({
            include: {
                model: RefreshToken,
                where: {
                    token: existingToken,
                },
            },
        });

        // If the user is not found, this might indicate an attempted refresh token reuse
        if (!foundUser) {
            jwt.verify(existingToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
                // If there's an error in verifying the JWT or if the user Id doesn't match, return a 403 Forbidden status
                if (err) {
                    return sendResponse(
                        res,
                        StatusCodes.FORBIDDEN,
                        generateMessage.refresh.tokenMismatch()
                    );
                }

                // Log attempted reuse and delete the refresh token from the database
                await RefreshToken.destroy({ where: { userId: decoded.userId } });
            });
            return sendResponse(
                res,
                StatusCodes.FORBIDDEN,
                generateMessage.refresh.attemptedReuse()
            );
        }

        // Delete the existing refresh token from the database
        await RefreshToken.destroy({ where: { token: existingToken } });

        // Verify the JWT with the refresh token secret
        jwt.verify(existingToken, process.env.REFRESH_TOKEN, async (err, decoded) => {
            // If there's an error in verifying the JWT or if the user Id doesn't match, return a 403 Forbidden status
            if (err || foundUser?.userId !== decoded?.userId) {
                return sendResponse(
                    res,
                    StatusCodes.FORBIDDEN,
                    generateMessage.refresh.expiredToken()
                );
            }

            const tokenData = {
                userId: decoded.userId,
                role: decoded.role,
            };

            // Create a new access token
            const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN, {
                expiresIn: '1d',
            });

            // Create a new refresh token
            const refreshToken = jwt.sign(tokenData, process.env.REFRESH_TOKEN, {
                expiresIn: '1d',
            });

            // Save the new refresh token in the database
            await foundUser.createRefreshToken({ token: refreshToken });

            // Set the new refresh token as a secure cookie
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000,
            });

            // Return the new access token in the res
            sendResponse(res, StatusCodes.OK, generateMessage.refresh.success(), {
                accessToken,
            });
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            // handle validation error
        }

        sendResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            generateMessage.refresh.error(),
            null,
            error,
            'ERR9001'
        );
    }
};
