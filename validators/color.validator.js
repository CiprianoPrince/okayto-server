const { body } = require('express-validator');

exports.validateName = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Color name is required')
        .isAlpha()
        .withMessage('Color name must contain only letters')
        .isLength({ min: 1 })
        .withMessage('Color name must be at least 3 characters long')
        .escape(),
];

exports.validateCode = [
    body('code')
        .trim()
        .notEmpty()
        .withMessage('Color code is required')
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage('Color code must be a valid hex code (e.g. #000000 or #000)')
        .escape(),
];
