// Import necessary modules
const db = require('../models');
const Product = db.Product;
const Color = db.Color;
const ProductColor = db.ProductColor;
const Variant = db.Variant;
const Size = db.Size;
const VariantImage = db.VariantImage;
const Inventory = db.Inventory;

const { col } = require('sequelize');

const { ValidationError } = require('sequelize');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

// Import helper functions
const {
    sendResponse,
    generateMessage,
    getModelName,
    formatValidationError,
    deleteImageSync,
    formatProductVariant,
    formatProductVariants,
} = require('../helpers');

// Fetch the model name based on the filename
const modelName = getModelName(__filename);

// Fetch all variant
exports.findAll = async (req, res) => {
    try {
        const productId = req.params.productId;

        const foundProductVariants = await Product.findOne({
            where: { productId },
            attributes: [],
            include: [
                {
                    model: ProductColor,
                    attributes: ['productId'],
                    include: [
                        {
                            model: Color,
                            attributes: ['colorId', 'name', 'code'],
                        },
                        {
                            model: VariantImage,
                            attributes: ['variantImageId', 'imagePath', 'altText'],
                        },
                        {
                            model: Variant,
                            attributes: ['variantId'],
                            include: [
                                {
                                    model: Inventory,
                                    attributes: [
                                        'inventoryId',
                                        'quantityInStock',
                                        'reOrderThreshold',
                                        'lastRestockDate',
                                    ],
                                },
                                {
                                    model: Size,
                                    attributes: ['sizeId', 'name'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!foundProductVariants.ProductColors.length) {
            return sendResponse(
                res,
                StatusCodes.NO_CONTENT,
                generateMessage.findAll.fail(modelName)
            );
        }

        const formattedFoundProductVariants = formatProductVariants(foundProductVariants);

        sendResponse(
            res,
            StatusCodes.OK,
            generateMessage.findAll.success(modelName, formattedFoundProductVariants.length),
            formattedFoundProductVariants
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
        // const dbVariantData = await Variant.findByPk(variantId);

        const foundProductVariant = await Variant.findByPk(variantId, {
            attributes: ['variantId'],
            include: [
                {
                    model: ProductColor,
                    attributes: ['productColorId'],
                    include: [
                        {
                            model: Product,
                            attributes: ['productId', 'categoryId', 'name', 'price', 'slug'],
                        },
                        {
                            model: Color,
                            attributes: ['colorId', 'name', 'code'],
                        },
                        {
                            model: VariantImage,
                            attributes: ['variantImageId', 'imagePath', 'altText'],
                        },
                    ],
                },
                {
                    model: Size,
                    attributes: ['sizeId', 'name'],
                },
                {
                    model: Inventory,
                    attributes: [
                        'inventoryId',
                        'quantityInStock',
                        'reOrderThreshold',
                        'lastRestockDate',
                    ],
                },
            ],
        });

        if (!foundProductVariant) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.findByPk.fail(modelName, variantId)
            );
        }

        const formattedFoundProductVariant = formatProductVariant(foundProductVariant);

        sendResponse(
            res,
            StatusCodes.OK,
            generateMessage.findByPk.success(modelName),
            formattedFoundProductVariant
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error
        }

        console.log(error);

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
            errors.formatWith(formatValidationError).mapped()
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

        const productColorId = req.body.productColorId;

        // Extract variant data from req body
        const rawVariantData = req.body;

        const variantData = {
            sizeId: rawVariantData.sizeId,
        };

        const extraData = {
            inventoryData: {
                quantityInStock: rawVariantData.quantityInStock,
                reOrderThreshold: rawVariantData.reOrderThreshold ?? 50,
                lastRestockDate: rawVariantData.lastRestockDate
                    ? rawVariantData.lastRestockDate
                    : new Date().toISOString(),
            },
        };

        if (!productColorId) {
            extraData.productColorData = {
                productId: productId,
                colorId: rawVariantData.colorId,
            };

            extraData.variantImageData = {
                imagePath: rawVariantData.imagePath,
                altText: rawVariantData.altText,
            };
        } else {
            const foundVariantCount = await Variant.count({
                where: { productColorId, sizeId: rawVariantData.sizeId },
            });

            if (foundVariantCount) {
                return sendResponse(
                    res,
                    StatusCodes.BAD_REQUEST,
                    generateMessage.createOne.fail("Product's variant already exist")
                );
            }

            variantData.productColorId = productColorId;
        }

        // Create a new variant for the product
        const createdVariant = await Variant.create(variantData, {
            extraData: extraData,
            hooks: true,
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

        console.log(error);

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
