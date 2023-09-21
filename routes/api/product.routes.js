module.exports = (app) => {
    const router = require('express').Router();
    const { verifyRoles } = require('../../middlewares');
    const { ROLES } = require('../../constants');
    const { uploadProductImage } = require('../../middlewares');
    const { productValidator } = require('../../validators');
    const { productController } = require('../../controllers');

    // Retrieve all products.
    router.get('/', verifyRoles(ROLES.Admin, ROLES.User, ROLES.Guest), productController.findAll);

    //  Retrieve details of a specific product.
    router.get(
        '/:productId',
        verifyRoles(ROLES.Admin, ROLES.User, ROLES.Guest),
        productController.findByPk
    );

    // Add a new product.
    router.post(
        '/',
        verifyRoles(ROLES.Admin),
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
        verifyRoles(ROLES.Admin),
        uploadProductImage.single('productImage'),
        productValidator.validateCategoryId,
        productValidator.validateName,
        productValidator.validateDescription,
        productValidator.validatePrice,
        productController.updateOne
    );

    //  Delete a product.
    router.delete('/:productId', verifyRoles(ROLES.Admin), productController.deleteOne);

    app.use('/api/products', router);
};
