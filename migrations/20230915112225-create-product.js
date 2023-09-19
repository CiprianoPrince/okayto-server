'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Products', {
            productID: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            categoryID: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'categories',
                    key: 'categoryID',
                },
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            description: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            price: {
                allowNull: false,
                type: Sequelize.DECIMAL(10, 2),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Products');
    },
};
