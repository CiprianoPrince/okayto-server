module.exports = (app) => {
    const router = require('express').Router();
    const { verifyRoles } = require('../../middlewares');
    const { ROLES } = require('../../constants');
    const { categoryValidator } = require('../../validators');
    const { categoryController } = require('../../controllers');

    // Retrieve all category.
    router.get('/', verifyRoles(ROLES.Admin, ROLES.User, ROLES.Guest), categoryController.findAll);

    //  Retrieve details of a specific category.
    router.get(
        '/:categoryId',
        verifyRoles(ROLES.Admin, ROLES.User, ROLES.Guest),
        categoryController.findByPk
    );

    // Add a new category.
    router.post(
        '/',
        verifyRoles(ROLES.Admin),
        categoryValidator.validateName,
        categoryValidator.validateDescription,
        categoryController.createOne
    );

    //  Update a category's details.
    router.put(
        '/:categoryId',
        verifyRoles(ROLES.Admin),
        categoryValidator.validateName,
        categoryValidator.validateDescription,
        categoryController.updateOne
    );

    //  Delete a category.
    router.delete('/:categoryId', verifyRoles(ROLES.Admin), categoryController.deleteOne);

    app.use('/api/categories', router);
};
