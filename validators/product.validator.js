const { body } = require('express-validator');

exports.validateCategoryId = [
    body('categoryId')
        .trim()
        .notEmpty()
        .withMessage('categoryId is required')
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
        )
        .withMessage('categoryId must be a valid UUID V4'),
];

exports.validateName = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .matches(/^[\p{L}\p{N}\s.,?!;:%'"()\-&]+$/u)
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
        .matches(/^[\p{L}\p{N}\s.,?!;:%'"()\-&]+$/u)
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

exports.validateSizeId = [
    body('sizeId')
        .trim()
        .notEmpty()
        .withMessage('sizeId is required')
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
        )
        .withMessage('sizeId must be a valid UUID V4'),
];

exports.validateColorId = [
    body('colorId')
        .trim()
        .notEmpty()
        .withMessage('colorId is required')
        .matches(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
        )
        .withMessage('colorId must be a valid UUID V4'),
];

exports.validateImage = [
    body('imagePath')
        .trim()
        .notEmpty()
        .withMessage('Image path is required')
        .matches(/\.(jpeg|jpg|png|webp)$/i)
        .withMessage('Image path must be a valid image format (e.g., .jpg, .jpeg, .png, etc.)'),

    body('altText')
        .trim()
        .notEmpty()
        .withMessage('Image alt text is required and should not be empty'),
];
