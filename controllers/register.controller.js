const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');

const { ValidationError } = require('sequelize');

const { validationResult } = require('express-validator');

const { StatusCodes } = require('http-status-codes');
const { generateMessage, sendResponse } = require('../helpers');

exports.handleNewUser = async (request, response) => {
    try {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return sendResponse(
                response,
                StatusCodes.BAD_REQUEST,
                generateMessage.all.emptyData(),
                null,
                errors.array()
            );
        }

        const rawUserData = request.body;

        const hashedPwd = await bcrypt.hash(rawUserData?.password, 10);
        rawUserData.password = hashedPwd;

        const dbUserData = await User.create(rawUserData, { role: 'Admin' });
        sendResponse(
            response,
            StatusCodes.OK,
            generateMessage.createOne.success('User'),
            dbUserData
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // handle validation error
        }
        sendResponse(
            response,
            StatusCodes.INTERNAL_SERVER_ERROR,
            generateMessage.createOne.failure('User'),
            null,
            error,
            'ERR9001'
        );
    }
};
