module.exports = (app) => {
    const router = require('express').Router();
    const { verifyRoles } = require('../middlewares');
    const { ROLES } = require('../constants');
    const { cartValidator } = require('../validators');
    const { cartController } = require('../controllers');

    // Retrieve all cart.
    router.get('/:userId/carts', verifyRoles(ROLES.USER), cartController.findAll);

    //  Retrieve details of a specific cart.
    router.get('/:userId/carts/:cardId', verifyRoles(ROLES.USER), cartController.findByPk);

    // Add a new cart.
    router.post(
        '/:userId/carts',
        verifyRoles(ROLES.USER),
        cartValidator.validateVariantId,
        cartValidator.validateQuantity,
        cartController.createOne
    );

    //  Update a cart's details.
    router.put(
        '/:userId/cart/:cartId',
        verifyRoles(ROLES.ADMIN),
        cartValidator.validateVariantId,
        cartValidator.validateQuantity,
        cartController.updateOne
    );

    //  Delete a cart.
    router.delete('/:userId/cart/:cartId', verifyRoles(ROLES.ADMIN), cartController.deleteOne);

    app.use('/users', router);
};
