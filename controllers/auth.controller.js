require('dotenv').config();

const db = require('../models');
const User = db.User;
const RefreshToken = db.RefreshToken;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { ROLES } = require('../constants');

const { ValidationError } = require('sequelize');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const {
    sendResponse,
    generateMessage,
    getModelName,
    formatValidationError,
} = require('../helpers');

const modelName = getModelName(__filename);

exports.handleLogin = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.auth.fail(),
                null,
                errors.formatWith(formatValidationError).mapped()
            );
        }

        const userData = req.body;

        // Find user by email
        const foundUser = await User.findOne({ where: { email: userData?.email } });
        if (!foundUser)
            return sendResponse(res, StatusCodes.UNAUTHORIZED, generateMessage.auth.fail());

        // Check password
        const isMatch = await bcrypt.compare(userData?.password, foundUser.password);
        if (!isMatch)
            return sendResponse(res, StatusCodes.UNAUTHORIZED, generateMessage.auth.fail());

        // Get user role
        const foundProfile = await foundUser.getProfile();
        const foundUserRole = ROLES[foundProfile.role];

        const tokenData = {
            userId: foundUser.userId,
            role: foundUserRole,
        };

        // Create JWTs
        const accessToken = jwt.sign(tokenData, process.env.ACCESS_TOKEN, {
            expiresIn: '1d',
        });

        const refreshToken = jwt.sign(tokenData, process.env.REFRESH_TOKEN, {
            expiresIn: '1d',
        });

        // Save new refresh token for the user
        await foundUser.createRefreshToken({ token: refreshToken });

        // Check for possible token reuse and handle accordingly
        if (req.cookies?.jwt) {
            const existingRefreshToken = req.cookies.jwt;
            const foundToken = await RefreshToken.findOne({
                where: { token: existingRefreshToken },
            });

            // Detected refresh token reuse!
            if (!foundToken) {
                // clear out ALL previous refresh tokens
                await RefreshToken.destroy({ where: { userId: foundUser.userId } });
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        }

        // Set cookie for refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Send access token to user
        sendResponse(res, StatusCodes.OK, generateMessage.auth.success(), {
            accessToken,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            // handle validation error
        }

        sendResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            generateMessage.auth.error(),
            null,
            error,
            'ERR9001'
        );
    }
};
