module.exports = (app) => {
    const router = require('express').Router();
    const { verifyRoles } = require('../../middlewares');
    const { ROLES } = require('../../constants');
    const { sizeValidator } = require('../../validators');
    const { sizeController } = require('../../controllers');

    // Retrieve all sizes.
    router.get('/', verifyRoles(ROLES.ADMIN, ROLES.USER, ROLES.GUEST), sizeController.findAll);

    //  Retrieve a specific size.
    router.get(
        '/:sizeId',
        verifyRoles(ROLES.ADMIN, ROLES.USER, ROLES.GUEST),
        sizeController.findByPk
    );

    // Place a new size.
    router.post(
        '/',
        verifyRoles(ROLES.ADMIN),
        sizeValidator.validateName,
        sizeController.createOne
    );

    // Update size details/status.
    router.put(
        '/:sizeId',
        verifyRoles(ROLES.ADMIN),
        sizeValidator.validateName,
        sizeController.updateOne
    );

    // Cancel an size.
    router.delete('/:sizeId', verifyRoles(ROLES.ADMIN), sizeController.deleteOne);

    // POST /sizes/{sizeId}/payments - Make a payment for an size.
    app.use('/api/sizes', router);
};
