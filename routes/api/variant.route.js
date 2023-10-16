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
        verifyRoles(ROLES.ADMIN, ROLES.USER, ROLES.GUEST),
        variantController.findAll
    );

    // Retrieve all product variants.
    router.get(
        '/:productId/variants',
        verifyRoles(ROLES.ADMIN, ROLES.USER, ROLES.GUEST),
        variantController.findAll
    );

    //  Retrieve details of a specific product variant.
    router.get(
        '/:productId/variants/:variantId',
        verifyRoles(ROLES.USER, ROLES.GUEST),
        variantController.findByPk
    );

    // Add a new product variant.
    router.post(
        '/:productId/variants',
        verifyRoles(ROLES.ADMIN),
        uploadVariantImage.single('image'),
        variantValidator.validateImage,
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
        verifyRoles(ROLES.ADMIN),
        uploadVariantImage.single('image'),
        variantValidator.validateImage,
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
        verifyRoles(ROLES.ADMIN),
        variantController.deleteOne
    );

    app.use('/api/products', router);
};
