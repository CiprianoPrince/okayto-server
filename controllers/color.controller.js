// Importing necessary modules
const db = require('../models');
const Color = db.Color;
const { ValidationError } = require('sequelize');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

// Importing helper functions
const { sendResponse, generateMessage, getModelName } = require('../helpers');

// Fetching the model name based on the filename
const modelName = getModelName(__filename);

// Fetch all colors
exports.findAll = async (req, res) => {
    try {
        const foundColors = await Color.findAll();

        // If there are no colors, send NO_CONTENT status code
        if (!foundColors.length) {
            return sendResponse(
                res,
                StatusCodes.NO_CONTENT,
                generateMessage.findAll.fail(modelName)
            );
        }

        // Send fetched colors with OK status code
        sendResponse(
            res,
            StatusCodes.OK,
            generateMessage.findAll.success(modelName, foundColors.length),
            foundColors
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error (currently not handling, but can be expanded)
        }
        // Send INTERNAL_SERVER_ERROR status code for other errors
        sendResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            generateMessage.findAll.error(modelName),
            null,
            error,
            'ERR9001'
        );
    }
};

// Fetch color by primary key
exports.findByPk = async (req, res) => {
    try {
        const colorId = req.params.colorId;
        const foundColor = await Color.findByPk(colorId);

        // If color not found, send BAD_REQUEST status code
        if (!foundColor) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.findByPk.fail(modelName, colorId)
            );
        }

        // Send fetched color data with OK status code
        sendResponse(res, StatusCodes.OK, generateMessage.findByPk.success(modelName), foundColor);
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error (currently not handling, but can be expanded)
        }
        // Send INTERNAL_SERVER_ERROR status code for other errors
        sendResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            generateMessage.findByPk.error(modelName),
            null,
            error,
            'ERR9001'
        );
    }
};

// Create a new color
exports.createOne = async (req, res) => {
    // Validate the req data
    const errors = validationResult(req);

    // If validation errors exist, send BAD_REQUEST status code
    if (!errors.isEmpty()) {
        return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            generateMessage.createOne.fail(),
            null,
            errors.array()
        );
    }

    try {
        const rawColorData = req.body;
        const createdColor = await Color.create(rawColorData);

        // Send created color data with OK status code
        sendResponse(
            res,
            StatusCodes.CREATED,
            generateMessage.createOne.success(modelName),
            createdColor
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error (currently not handling, but can be expanded)
        }
        // Send INTERNAL_SERVER_ERROR status code for other errors
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

// Update a color by primary key
exports.updateOne = async (req, res) => {
    // Validate the req data
    const errors = validationResult(req);

    // If validation errors exist, send BAD_REQUEST status code
    if (!errors.isEmpty()) {
        return sendResponse(
            res,
            StatusCodes.BAD_REQUEST,
            generateMessage.createOne.fail(),
            null,
            errors.array()
        );
    }

    try {
        const colorId = req.params.colorId;
        const rawColorData = req.body;

        // Update the color data
        const [updatedColorCount] = await Color.update(rawColorData, {
            where: { colorId },
        });

        // If no rows affected, send BAD_REQUEST status code
        if (!updatedColorCount) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.updateOne.fail(modelName)
            );
        }

        // Send affected rows count with OK status code
        sendResponse(res, StatusCodes.OK, generateMessage.updateOne.success(modelName), {
            updatedColorCount,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error (currently not handling, but can be expanded)
        }
        // Send INTERNAL_SERVER_ERROR status code for other errors
        sendResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            generateMessage.updateOne.error(modelName),
            null,
            error,
            'ERR9001'
        );
    }
};

// Delete a color by primary key
exports.deleteOne = async (req, res) => {
    try {
        const colorId = req.params.colorId;

        // Delete the color
        const deletedColorCount = await Color.destroy({ where: { colorId } });

        // If no rows deleted, send BAD_REQUEST status code
        if (!deletedColorCount) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.deleteOne.fail(modelName)
            );
        }

        // Send deleted rows count with OK status code
        sendResponse(res, StatusCodes.OK, generateMessage.deleteOne.success(modelName), {
            deletedColorCount,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error (currently not handling, but can be expanded)
        }
        // Send INTERNAL_SERVER_ERROR status code for other errors
        sendResponse(
            res,
            StatusCodes.INTERNAL_SERVER_ERROR,
            generateMessage.deleteOne.error(modelName),
            null,
            error,
            'ERR9001'
        );
    }
};
