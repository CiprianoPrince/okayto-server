const { body } = require('express-validator');

exports.validateCategoryID = [
    body('categoryID')
        .trim()
        .notEmpty()
        .withMessage('categoryID is required')
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
        )
        .withMessage('categoryID must be a valid UUID V4'),
];

exports.validateName = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .matches(/^[\p{L}\p{N}\s.,?!;:%'"()\-]+$/u)
        .withMessage('Product name must contain only letters and spaces')
        .isLength({ min: 3 })
        .withMessage('Product name must be at least 3 characters long')
        .escape(),
];

exports.validateDescription = [
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .matches(/^[\p{L}\p{N}\s.,?!;:%'"()\-]+$/u)
        .withMessage('Description must contain only letters')
        .isLength({ min: 3 })
        .withMessage('Description must be at least 3 characters long')
        .escape(),
];

exports.validatePrice = [
    body('price')
        .trim()
        .notEmpty()
        .withMessage('Price is required')
        .matches(/^\d+(\.\d{1,2})?$/)
        .withMessage('Price must be a valid float')
        .toFloat(), // Convert the value to float after validation
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
