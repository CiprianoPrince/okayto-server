const { body } = require('express-validator');

const UUID_REGEX =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

exports.validateVariantId = [
    body('variantId')
        .trim()
        .notEmpty()
        .withMessage('variantId is required')
        .matches(UUID_REGEX)
        .withMessage('variantId must be a valid UUID V4'),
];

exports.validateQuantity = [
    body('quantity')
        .trim()
        .notEmpty()
        .withMessage('Quantity is required')
        .isNumeric()
        .withMessage('Quantity must only contain digits'),
];
