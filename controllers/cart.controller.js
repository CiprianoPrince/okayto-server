// Importing necessary modules
const db = require('../models');
const Cart = db.Cart;
const CartDetail = db.CartDetail;
const Variant = db.Variant;
const ProductColor = db.ProductColor;
const Color = db.Color;
const VariantImage = db.VariantImage;
const Inventory = db.Inventory;
const Size = db.Size;

const { ValidationError } = require('sequelize');
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');

// Importing helper functions
const {
    sendResponse,
    generateMessage,
    getModelName,
    formatFoundCartVariants,
} = require('../helpers');

// Fetching the model name based on the filename
const modelName = getModelName(__filename);

// Fetch all carts
exports.findAll = async (req, res) => {
    try {
        const userId = req.params.userId;

        const foundCarts = await Cart.findAll({
            where: { userId },
            attributes: ['cartId', 'createdAt'],
            include: [
                {
                    model: CartDetail,
                    attributes: ['cartDetailId', 'quantity'],
                    include: [
                        {
                            model: Variant,
                            attributes: ['variantId'],
                            include: [
                                {
                                    model: ProductColor,
                                    attributes: ['productId'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        // const foundCarts = await Cart.findAll({
        //     where: { userId },
        //     attributes: ['cartId', 'createdAt'],
        //     include: [
        //         {
        //             model: CartDetail,
        //             attributes: ['cartDetailId', 'quantity'],
        //             include: [
        //                 {
        //                     model: Variant,
        //                     attributes: ['variantId'],
        //                     include: [
        //                         {
        //                             model: ProductColor,
        //                             attributes: ['productId'],
        //                             include: [
        //                                 {
        //                                     model: Color,
        //                                     attributes: ['colorId', 'name', 'code'],
        //                                 },
        //                                 {
        //                                     model: VariantImage,
        //                                     attributes: ['variantImageId', 'imagePath', 'altText'],
        //                                 },
        //                             ],
        //                         },
        //                         {
        //                             model: Inventory,
        //                             attributes: [
        //                                 'inventoryId',
        //                                 'quantityInStock',
        //                                 'reOrderThreshold',
        //                                 'lastRestockDate',
        //                             ],
        //                         },
        //                         {
        //                             model: Size,
        //                             attributes: ['sizeId', 'name'],
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //     ],
        // });

        // If there are no carts, send NO_CONTENT status code
        if (!foundCarts.length) {
            return sendResponse(
                res,
                StatusCodes.OK,
                generateMessage.findAll.fail(modelName),
                foundCarts
            );
        }

        const formattedFoundCartVariants = formatFoundCartVariants(foundCarts);

        // Send fetched carts with OK status code
        sendResponse(
            res,
            StatusCodes.OK,
            generateMessage.findAll.success(modelName, formattedFoundCartVariants.length),
            formattedFoundCartVariants
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

// Fetch cart by primary key
exports.findByPk = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const foundCart = await Cart.findByPk(cartId, {
            attributes: ['cartId', 'name', 'slug'],
        });

        // If cart not found, send BAD_REQUEST status code
        if (!foundCart) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.findByPk.fail(modelName, cartId)
            );
        }

        // Send fetched cart data with OK status code
        sendResponse(res, StatusCodes.OK, generateMessage.findByPk.success(modelName), foundCart);
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

// Create a new cart
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
        const userId = req.params.userId;

        const cartDetailsData = req.body;
        console.log(cartDetailsData);
        const createdCart = await Cart.create(
            { userId },
            {
                extraData: {
                    cartDetailsData,
                },
            }
        );

        // Send created cart data with OK status code
        sendResponse(
            res,
            StatusCodes.CREATED,
            generateMessage.createOne.success(modelName),
            createdCart
        );
    } catch (error) {
        if (error instanceof ValidationError) {
            // Handle validation error (currently not handling, but can be expanded)
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

// Update a cart by primary key
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
        const cartId = req.params.cartId;
        const cartData = req.body;

        // Update the cart data
        const [updatedCartCount] = await Cart.update(cartData, {
            where: { cartId },
        });

        // If no rows affected, send BAD_REQUEST status code
        if (!updatedCartCount) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.updateOne.fail(modelName)
            );
        }

        // Send affected rows count with OK status code
        sendResponse(res, StatusCodes.OK, generateMessage.updateOne.success(modelName), {
            updatedCartCount,
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

// Delete a cart by primary key
exports.deleteOne = async (req, res) => {
    try {
        const cartId = req.params.cartId;

        // Delete the cart
        const deletedCartCount = await Cart.destroy({ where: { cartId } });

        // If no rows deleted, send BAD_REQUEST status code
        if (!deletedCartCount) {
            return sendResponse(
                res,
                StatusCodes.BAD_REQUEST,
                generateMessage.deleteOne.fail(modelName)
            );
        }

        // Send deleted rows count with OK status code
        sendResponse(res, StatusCodes.OK, generateMessage.deleteOne.success(modelName), {
            deletedCartCount,
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
