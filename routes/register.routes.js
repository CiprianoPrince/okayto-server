module.exports = (app) => {
    const router = require('express').Router();
    const { registerController } = require('../controllers');
    const { authController } = require('../controllers');

    router.post('/', registerController.handleNewUser, authController.handleLogin);

    app.use('/register', router);
};
