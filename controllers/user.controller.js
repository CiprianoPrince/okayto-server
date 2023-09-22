const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');

const { ValidationError } = require('sequelize');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

const {
    generateMessage,
    sendResponse,
    getModelName,
    formatValidationError,
} = require('../helpers');

const modelName = getModelName(__filename);

exports.createOne = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.createOne.fail(modelName),
                null,
                errors.formatWith(formatValidationError).mapped()
            );
        }

        const rawUserData = req.body;

        const saltRounds = 12; // configurable value
        const hashedPassword = await bcrypt.hash(rawUserData?.password, saltRounds);

        const userData = { ...rawUserData, password: hashedPassword };

        await User.create(userData, { role: 'USER' });

        sendResponse(res, StatusCodes.CREATED, generateMessage.createOne.success(modelName));
    } catch (error) {
        if (error instanceof ValidationError) {
            // handle validation error
        }
        sendResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            generateMessage.createOne.error(modelName),
            null,
            error,
            'ERR9001'
        );
    }
};
