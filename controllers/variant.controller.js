// Import necessary modules
const db = require('../models');
const Product = db.Product;
const ProductVariant = db.ProductVariant;
const Variant = db.Variant;
const Size = db.Size;
const Color = db.Color;
const VariantImage = db.VariantImage;
const Inventory = db.Inventory;

const { ValidationError } = require('sequelize');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

// Import helper functions
const { sendResponse, generateMessage, getModelName, deleteImageSync } = require('../helpers');

// Fetch the model name based on the filename
const modelName = getModelName(__filename);

// Fetch all variant
exports.findAll = async (req, res) => {
    try {
        // const variants = await ProductVariant.findAll();
        const productId = req.params.productId;

        const foundVariants = await ProductVariant.findAll({
            where: { productId },
            attributes: ['productId', 'variantId'],
            include: [
                {
                    model: Size,
                    attributes: ['sizeId', 'name'],
                },
                {
                    model: Color,
                    attributes: ['colorId', 'name'],
                },
                {
                    model: Variant,
                    include: [
                        {
                            model: VariantImage,
                            attributes: ['imagePath', 'altText'],
                        },
                        {
                            model: Inventory,
                            attributes: ['quantityInStock'],
                        },
                    ],
                },
            ],
        });

        if (!foundVariants.length) {
            return sendResponse(
                res,
                StatusCodes.NO_CONTENT,
                generateMessage.findAll.fail(modelName)
            );
        }

        sendResponse(
            res,
            StatusCodes.OK,
            generateMessage.findAll.success(modelName, foundVariants.length),
            foundVariants
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
        }
        console.log(error);
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

// Fetch variant by primary key
exports.findByPk = async (req, res) => {
    try {
        const variantId = req.params.variantId;
        const dbVariantData = await Variant.findByPk(variantId);

        if (!dbVariantData) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.findByPk.fail(modelName, variantId)
            );
        }

        sendResponse(
            res,
            StatusCodes.OK,
            generateMessage.findByPk.success(modelName),
            dbVariantData
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
        }

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

// Add a variant to a product
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
        // Extract product Id from req params
        const productId = req.params.productId;

        // Check if product exists
        const foundProduct = await Product.findByPk(productId);

        if (!foundProduct) {
            return sendResponse(
                res,
                StatusCodes.NOT_FOUND,
                generateMessage.findByPk.fail('Product', productId)
            );
        }

        // Extract variant data from req body
        const { sizeId, colorId, quantityInStock } = req.body;
        const imagePath = req.file.filename;

        const variantData = {
            productId,
        };

        const extraData = {
            sizeId,
            colorId,
            inventory: {
                quantityInStock,
                reOrderThreshold: req.body.reOrderThreshold ?? 50,
                lastRestockDate: req.body.lastRestockDate ?? new Date().toISOString(),
            },
            image: {
                imagePath: imagePath,
                altText: imagePath,
            },
        };

        // Create a new variant for the product
        const createdVariant = await Variant.create(variantData, {
            extraData: extraData,
        });

        // Send the created variant data with CREATED status code
        sendResponse(
            res,
            StatusCodes.CREATED,
            generateMessage.createOne.success(modelName),
            createdVariant
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.createOne.fail(),
                null,
                error.errors
            );
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

// Update a variant by primary key
exports.updateOne = async (req, res) => {
    const errors = validationResult(req);

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
        const variantId = req.params.variantId;
        const rawVariantData = req.body;

        // Get associated image(s) for the variant
        const variantWithImages = await Variant.findOne({
            where: { variantId },
            include: [ImageModel],
        });

        if (variantWithImages) {
            const foundImage = variantWithImages.Image;

            // Delete image from the directory
            await deleteImageSync(foundImage.imagePath);
        }

        const [affectedRows] = await Variant.update(rawVariantData, {
            where: { variantId },
        });

        if (!affectedRows) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.updateOne.fail(modelName)
            );
        }

        sendResponse(res, StatusCodes.OK, generateMessage.updateOne.success(modelName), {
            affectedRows,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
        }

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

// Delete a variant by primary key
exports.deleteOne = async (req, res) => {
    try {
        const variantId = req.params.variantId;

        // Get associated image(s) for the variant
        const variantWithImages = await Variant.findOne({
            where: { variantId },
            include: [ImageModel],
        });

        if (variantWithImages) {
            const foundImage = variantWithImages.Image;

            // Delete image from the directory
            await deleteImageSync(foundImage.imagePath);
        }

        const deletedRows = await Variant.destroy({ where: { variantId } });

        if (!deletedRows) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.deleteOne.fail(modelName)
            );
        }

        sendResponse(res, StatusCodes.OK, generateMessage.deleteOne.success(modelName), {
            deletedRows,
        });
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
        }

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
