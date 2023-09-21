module.exports = (app) => {
    const router = require('express').Router();
    const { verifyRoles } = require('../../middlewares');
    const { ROLES } = require('../../constants');
    const { colorValidator } = require('../../validators');
    const { colorController } = require('../../controllers');

    // Retrieve all colors.
    router.get('/', verifyRoles(ROLES.Admin, ROLES.User, ROLES.Guest), colorController.findAll);

    //  Retrieve a specific color.
    router.get(
        '/:colorId',
        verifyRoles(ROLES.Admin, ROLES.User, ROLES.Guest),
        colorController.findByPk
    );

    // Place a new color.
    router.post(
        '/',
        verifyRoles(ROLES.Admin),
        colorValidator.validateName,
        colorValidator.validateCode,
        colorController.createOne
    );

    // Update color details/status.
    router.put(
        '/:colorId',
        verifyRoles(ROLES.Admin),
        colorValidator.validateName,
        colorValidator.validateCode,
        colorController.updateOne
    );

    // Cancel an color.
    router.delete('/:colorId', verifyRoles(ROLES.Admin), colorController.deleteOne);

    // POST /colors/{colorId}/payments - Make a payment for an color.
    app.use('/api/colors', router);
};
