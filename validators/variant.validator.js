const { body } = require('express-validator');

const UUID_REGEX =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

exports.validateproductId = [
    body('productId')
        .trim()
        .notEmpty()
        .withMessage('productId is required')
        .matches(UUID_REGEX)
        .withMessage('productId must be a valid UUID V4'),
];

exports.validateSizeId = [
    body('sizeId')
        .trim()
        .notEmpty()
        .withMessage('sizeId is required')
        .matches(UUID_REGEX)
        .withMessage('sizeId must be a valid UUID V4'),
];

exports.validateColorId = [
    body('colorId')
        .trim()
        .notEmpty()
        .withMessage('colorId is required')
        .matches(UUID_REGEX)
        .withMessage('colorId must be a valid UUID V4'),
];

exports.validateQuantityInStock = [
    body('quantityInStock')
        .trim()
        .notEmpty()
        .withMessage('Quantity in stock is required')
        .isNumeric()
        .withMessage('Quantity in stock must only contain digits'),
];

exports.validateImagePath = [
    body('imagePath')
        .trim()
        .notEmpty()
        .withMessage('Image path is required')
        .matches(/\.(jpeg|jpg|png|gif|bmp|webp)$/i)
        .withMessage('Image path must be a valid image format (e.g., .jpg, .jpeg, .png, etc.)'),
];

exports.validateReOrderThreshold = [
    body('reOrderThreshold')
        .optional({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage('reOrderThreshold is required')
        .isInt()
        .withMessage('reOrderThreshold must be an integer'),
];

exports.validateLastRestockDate = [
    body('lastRestockDate')
         .optional({ checkFalsy: true })
        .trim()
        .notEmpty()
        .withMessage('lastRestockDate is required')
        .isISO8601()
        .withMessage('lastRestockDate must be a valid date in ISO string format'),
];
