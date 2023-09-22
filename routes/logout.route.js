module.exports = (app) => {
    const router = require('express').Router();
    const { logoutController } = require('../controllers');

    router.get('/', logoutController.handleLogout);

    app.use('/logout', router);
};
