module.exports = (app) => {
    const router = require('express').Router();
    const { verifyRoles } = require('../../middlewares');
    const { ROLES } = require('../../constants');
    const { colorValidator } = require('../../validators');
    const { colorController } = require('../../controllers');

    // Retrieve all colors.
    router.get('/', verifyRoles(ROLES.ADMIN, ROLES.USER, ROLES.GUEST), colorController.findAll);

    //  Retrieve a specific color.
    router.get(
        '/:colorId',
        verifyRoles(ROLES.ADMIN, ROLES.USER, ROLES.GUEST),
        colorController.findByPk
    );

    // Place a new color.
    router.post(
        '/',
        verifyRoles(ROLES.ADMIN),
        // colorValidator.validateName,
        colorValidator.validateCode,
        colorController.createOne
    );

    // Update color details/status.
    router.put(
        '/:colorId',
        verifyRoles(ROLES.ADMIN),
        colorValidator.validateName,
        colorValidator.validateCode,
        colorController.updateOne
    );

    // Cancel an color.
    router.delete('/:colorId', verifyRoles(ROLES.ADMIN), colorController.deleteOne);

    // POST /colors/{colorId}/payments - Make a payment for an color.
    app.use('/api/colors', router);
};
