module.exports = (app) => {
    const router = require('express').Router();
    const { refreshTokenController } = require('../controllers');

    router.get('/', refreshTokenController.handleRefreshToken);

    app.use('/refresh', router);
};
