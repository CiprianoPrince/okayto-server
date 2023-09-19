const { body } = require('express-validator');

exports.validateName = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Size name is required')
        .custom((value) => {
            const allowedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            if (!allowedSizes.includes(value)) {
                throw new Error('Invalid size name');
            }
            return true;
        })
        .escape(),
];
