module.exports = (app) => {
    const router = require('express').Router();
    const { verifyRoles } = require('../../middlewares');
    const { ROLES } = require('../../constants');
    const { uploadVariantImage } = require('../../middlewares');
    const { variantValidator } = require('../../validators');
    const { variantController } = require('../../controllers');

    // Retrieve all product variants.
    router.get(
        '/:productId/variants',
        verifyRoles(ROLES.Admin, ROLES.User, ROLES.Guest),
        variantController.findAll
    );

    //  Retrieve details of a specific product variant.
    router.get(
        '/:productId/variants/:variantId',
        verifyRoles(ROLES.Admin, ROLES.User),
        variantController.findByPk
    );

    // Add a new product variant.
    router.post(
        '/:productId/variants',
        verifyRoles(ROLES.Admin),
        uploadVariantImage.single('variantImage'),
        variantValidator.validateColorId,
        variantValidator.validateSizeId,
        variantValidator.validateQuantityInStock,
        variantValidator.validateReOrderThreshold,
        variantValidator.validateLastRestockDate,
        variantController.createOne
    );

    //  Update a product variant's  details.
    router.put(
        '/:productId/variants/:variantId',
        verifyRoles(ROLES.Admin),
        uploadVariantImage.single('variantImage'),
        variantValidator.validateSizeId,
        variantValidator.validateColorId,
        variantValidator.validateQuantityInStock,
        variantValidator.validateReOrderThreshold,
        variantValidator.validateLastRestockDate,
        variantController.updateOne
    );

    //  Delete a product.
    router.delete(
        '/:productId/variants/:variantId',
        verifyRoles(ROLES.Admin),
        variantController.deleteOne
    );

    app.use('/api/products', router);
};
