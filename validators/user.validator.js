const { body } = require('express-validator');

exports.validateFirstName = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .isAlpha()
        .withMessage('First name must contain only letters')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long')
        .escape(),
];

exports.validatelastName = [
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .isAlpha()
        .withMessage('Last name must contain only letters')
        .isLength({ min: 3 })
        .withMessage('Last name must be at least 3 characters long')
        .escape(),
];

exports.validateEmail = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .escape(),
];

exports.validateAddress = [
    body('address.barangay').trim().notEmpty().withMessage('Barangay is required').escape(),
    body('address.city').trim().notEmpty().withMessage('City is required').escape(),
    body('address.region').trim().notEmpty().withMessage('Region is required').escape(),
    body('address.zip')
        .trim()
        .isLength({ min: 4, max: 4 })
        .withMessage('Zip code should be 4 digits')
        .isNumeric()
        .withMessage('Zip code should be numeric'),
];

exports.validatePhone = [
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required')
        .matches('/^(+)?(63)?(-| )?(()?0?(-| )?(()?(d{3})())?(-| )?(d{3})(-| )?(d{4})$/')
        .withMessage('Invalid phone number format'),
];
