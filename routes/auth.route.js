module.exports = (app) => {
    const router = require('express').Router();
    const { userValidator } = require('../validators');
    const { authController } = require('../controllers');

    router.post(
        '/',
        userValidator.validateEmail,
        userValidator.validatePassword,
        authController.handleLogin
    );

    app.use('/auth', router);
};
