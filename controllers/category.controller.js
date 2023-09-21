// Importing necessary modules
const db = require('../models');
const Category = db.Category;
const { ValidationError } = require('sequelize');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

// Importing helper functions
const { sendResponse, generateMessage, getModelName } = require('../helpers');

// Fetching the model name based on the filename
const modelName = getModelName(__filename);

// Fetch all categories
exports.findAll = async (req, res) => {
    try {
        const foundCategories = await Category.findAll({ attributes: ['categoryId', 'name'] });

        // If there are no categories, send NO_CONTENT status code
        if (!foundCategories.length) {
            return sendResponse(
                res,
                StatusCodes.NO_CONTENT,
                generateMessage.findAll.fail(modelName)
            );
        }

        // Send fetched categories with OK status code
        sendResponse(
            res,
            StatusCodes.OK,
            generateMessage.findAll.success(modelName, foundCategories.length),
            foundCategories
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

// Fetch category by primary key
exports.findByPk = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const foundCategory = await Category.findByPk(categoryId);

        // If category not found, send BAD_REQUEST status code
        if (!foundCategory) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.findByPk.fail(modelName, categoryId)
            );
        }

        // Send fetched category data with OK status code
        sendResponse(
            res,
            StatusCodes.OK,
            generateMessage.findByPk.success(modelName),
            foundCategory
        );
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

// Create a new category
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
        const categoryData = req.body;
        const createdCategory = await Category.create(categoryData);

        // Send created category data with OK status code
        sendResponse(
            res,
            StatusCodes.CREATED,
            generateMessage.createOne.success(modelName),
            createdCategory
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

// Update a category by primary key
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
        const categoryId = req.params.categoryId;
        const categoryData = req.body;

        // Update the category data
        const [updatedCategoryCount] = await Category.update(categoryData, {
            where: { categoryId },
        });

        // If no rows affected, send BAD_REQUEST status code
        if (!updatedCategoryCount) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.updateOne.fail(modelName)
            );
        }

        // Send affected rows count with OK status code
        sendResponse(res, StatusCodes.OK, generateMessage.updateOne.success(modelName), {
            updatedCategoryCount,
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

// Delete a category by primary key
exports.deleteOne = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        // Delete the category
        const deletedCategoryCount = await Category.destroy({ where: { categoryId } });

        // If no rows deleted, send BAD_REQUEST status code
        if (!deletedCategoryCount) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.deleteOne.fail(modelName)
            );
        }

        // Send deleted rows count with OK status code
        sendResponse(res, StatusCodes.OK, generateMessage.deleteOne.success(modelName), {
            deletedCategoryCount,
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
