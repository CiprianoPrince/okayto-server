module.exports = (app) => {
    const router = require('express').Router();
    const { registerController } = require('../controllers');

    router.post('/', registerController.handleNewUser);

    app.use('/register', router);
};
