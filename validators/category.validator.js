const { body } = require('express-validator');

exports.validateName = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Category name must contain only letters and spaces')
        .isLength({ min: 3 })
        .withMessage('Category name must be at least 3 characters long')
        .escape(),
];

exports.validateDescription = [
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .matches(/^[a-zA-Z0-9\s.,?!;:%'"()\-]+$/)
        .withMessage('Description must contain only letters')
        .isLength({ min: 3 })
        .withMessage('Description must be at least 3 characters long')
        .escape(),
];
