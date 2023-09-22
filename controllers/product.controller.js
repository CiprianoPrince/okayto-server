// Import necessary modules
const db = require('../models');
const { col } = require('sequelize');
const Product = db.Product;
const ProductImage = db.ProductImage;
const Size = db.Size;
const Color = db.Color;

const { ValidationError } = require('sequelize');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

// Import helper functions
const {
    sendResponse,
    generateMessage,
    getModelName,
    formatValidationError,
} = require('../helpers');

const { toSlug } = require('../utils');

// Fetch the model name based on the filename
const modelName = getModelName(__filename);

// Fetch all products
exports.findAll = async (req, res) => {
    try {
        // Fetch all products from the database
        const foundProducts = await Product.findAll({
            attributes: [
                'productId',
                'name',
                'description',
                'price',
                'categoryId',
                [col('ProductImage.imagePath'), 'imagePath'], // Custom alias
                [col('ProductImage.altText'), 'altText'], // Custom alias
                [col('Colors.name'), 'color'],
                [col('Sizes.name'), 'size'],
            ],
            include: [
                {
                    model: ProductImage,
                    attributes: [], // Exclude default attributes
                },
                {
                    model: Color,
                    attributes: [],
                },
                {
                    model: Size,
                    attributes: [],
                },
            ],
        });

        // If there are no products, send NO_CONTENT status code
        if (!foundProducts.length) {
            return sendResponse(
                res,
                StatusCodes.NO_CONTENT,
                generateMessage.findAll.fail(modelName)
            );
        }

        // Send fetched products with OK status code
        sendResponse(
            res,
            StatusCodes.OK,
            generateMessage.findAll.success(modelName, foundProducts.length),
            foundProducts
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
        }
        console.log(error);
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

// Fetch product by primary key
exports.findByPk = async (req, res) => {
    try {
        // Extract product Id from req params
        const productId = req.params.productId;
        // Fetch the product with the specified Id
        const foundProduct = await Product.findByPk(productId, {
            attributes: [
                'productId',
                'name',
                'description',
                'price',
                'categoryId',
                [col('ProductImage.imagePath'), 'imagePath'], // Custom alias
                [col('ProductImage.altText'), 'altText'], // Custom alias
                [col('Colors.name'), 'color'],
                [col('Sizes.name'), 'size'],
            ],
            include: [
                {
                    model: ProductImage,
                    attributes: [], // Exclude default attributes
                },
                {
                    model: Color,
                    attributes: [],
                },
                {
                    model: Size,
                    attributes: [],
                },
            ],
        });

        // If product not found, send BAD_REQUEST status code
        if (!foundProduct) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.findByPk.fail(modelName, productId)
            );
        }

        // Send fetched product data with OK status code
        sendResponse(
            res,
            StatusCodes.OK,
            generateMessage.findByPk.success(modelName),
            foundProduct
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
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

// Create a new product
exports.createOne = async (req, res) => {
    try {
        // Validate the req data
        const errors = validationResult(req);

        // If validation errors exist, send BAD_REQUEST status code
        if (!errors.isEmpty()) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.createOne.fail(),
                null,
                errors.formatWith(formatValidationError).mapped()
            );
        }

        // Extract variant data from req body
        const rawProductData = req.body;
        const productSlug = toSlug(`${rawProductData.name}-tshirt`);
        const productData = { ...rawProductData, slug: productSlug };

        const imagePath = req.file?.filename;
        const extraData = {
            image: {
                imagePath: imagePath,
                altText: productData.name,
            },
        };

        // Create a new variant for the product
        const createdProduct = await Product.create(productData, { extraData });

        // Send the created product data with OK status code
        sendResponse(
            res,
            StatusCodes.CREATED,
            generateMessage.createOne.success(modelName),
            createdProduct
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
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

// Update a product by primary key
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
        // Extract product Id and data from req
        const productId = req.params.productId;
        const productData = req.body;

        // Update the product with the specified Id
        const [updatedProductCount] = await Product.update(productData, {
            where: { productId },
        });

        // If no rows affected, send BAD_REQUEST status code
        if (!updatedProductCount) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.updateOne.fail(modelName)
            );
        }

        // Send affected rows count with OK status code
        sendResponse(res, StatusCodes.OK, generateMessage.updateOne.success(modelName), {
            updatedProductCount,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
        }

        console.log(error);
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

// Delete a product by primary key
exports.deleteOne = async (req, res) => {
    try {
        // Extract product Id from req params
        const productId = req.params.productId;

        // Delete the product with the specified Id
        const deletedProductCount = await Product.destroy({ where: { productId } });

        // If no rows deleted, send BAD_REQUEST status code
        if (!deletedProductCount) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.deleteOne.fail(modelName)
            );
        }

        // Send deleted rows count with OK status code
        sendResponse(res, StatusCodes.OK, generateMessage.deleteOne.success(modelName), {
            deletedProductCount,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
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
