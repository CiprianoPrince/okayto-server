module.exports = (app) => {
    const router = require('express').Router();
    const { authController } = require('../controllers');

    router.post('/', authController.handleLogin);

    app.use('/auth', router);
};
