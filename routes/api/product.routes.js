module.exports = (app) => {
    const router = require('express').Router();
    const { verifyRoles } = require('../../middlewares');
    const { ROLES } = require('../../constants');
    const { uploadProductImage } = require('../../middlewares');
    const { productValidator } = require('../../validators');
    const { productController } = require('../../controllers');

    // Retrieve all products.
    router.get('/', verifyRoles(ROLES.ADMIN, ROLES.USER, ROLES.GUEST), productController.findAll);

    //  Retrieve details of a specific product.
    router.get(
        '/:productId',
        verifyRoles(ROLES.ADMIN, ROLES.USER, ROLES.GUEST),
        productController.findByPk
    );

    // Add a new product.
    router.post(
        '/',
        verifyRoles(ROLES.ADMIN),
        uploadProductImage.single('productImage'),
        productValidator.validateCategoryId,
        productValidator.validateName,
        productValidator.validateDescription,
        productValidator.validatePrice,
        productController.createOne
    );

    //  Update a product's details.
    router.put(
        '/:productId',
        verifyRoles(ROLES.ADMIN),
        uploadProductImage.single('productImage'),
        productValidator.validateCategoryId,
        productValidator.validateName,
        productValidator.validateDescription,
        productValidator.validatePrice,
        productController.updateOne
    );

    //  Delete a product.
    router.delete('/:productId', verifyRoles(ROLES.ADMIN), productController.deleteOne);

    app.use('/api/products', router);
};
