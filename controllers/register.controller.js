const db = require('../models');
const User = db.User;
const bcrypt = require('bcrypt');

const { ValidationError } = require('sequelize');

const { validationResult } = require('express-validator');

const { StatusCodes } = require('http-status-codes');
const { generateMessage, sendResponse } = require('../helpers');

exports.handleNewUser = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.all.emptyData(),
                null,
                errors.array()
            );
        }

        const rawUserData = req.body;

        const hashedPwd = await bcrypt.hash(rawUserData?.password, 10);
        rawUserData.password = hashedPwd;

        await User.create(rawUserData, { role: 'Admin' });

        sendResponse(res, StatusCodes.CREATED, generateMessage.createOne.success('User'), null);
    } catch (error) {
        if (error instanceof ValidationError) {
            // handle validation error
        }
        sendResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            generateMessage.createOne.failure('User'),
            null,
            error,
            'ERR9001'
        );
    }
};
