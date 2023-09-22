module.exports = (app) => {
    const router = require('express').Router();
    const { userValidator } = require('../validators');
    const { userController } = require('../controllers');
    const { authController } = require('../controllers');

    router.post(
        '/register',
        userValidator.validateFirstName,
        userValidator.validatelastName,
        userValidator.validateEmail,
        userValidator.validatePassword,
        userController.createOne,
        authController.handleLogin
    );

    app.use('/', router);
};
