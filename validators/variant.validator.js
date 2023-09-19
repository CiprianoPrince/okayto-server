const { body } = require('express-validator');

exports.validateproductID = [
    body('productID')
        .trim()
        .notEmpty()
        .withMessage('productID is required')
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
        )
        .withMessage('productID must be a valid UUID V4'),
];

exports.validateSizeID = [
    body('sizeID')
        .trim()
        .notEmpty()
        .withMessage('sizeID is required')
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
        )
        .withMessage('sizeID must be a valid UUID V4'),
];

exports.validateColorID = [
    body('colorID')
        .trim()
        .notEmpty()
        .withMessage('colorID is required')
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
        )
        .withMessage('colorID must be a valid UUID V4'),
];

// exports.validateSize = [
//     body('size')
//         .trim()
//         .notEmpty()
//         .withMessage('Size name is required')
//         .isIn(['S', 'M', 'L'])
//         .withMessage('Size must be one of [S, M, L]'),
// ];

// exports.validateColor = [
//     body('color')
//         .trim()
//         .notEmpty()
//         .withMessage('Color is required')
//         .isString()
//         .withMessage('Color must be a string'),
// ];

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
        .optional()
        .trim()
        .notEmpty()
        .withMessage('reOrderThreshold is required')
        .isInt()
        .withMessage('reOrderThreshold must be an integer'),
];

exports.validateLastRestockDate = [
    body('lastRestockDate')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('lastRestockDate is required')
        .isISO8601()
        .withMessage('lastRestockDate must be a valid date in ISO string format'),
];
