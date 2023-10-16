'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('CartDetails', {
            cartDetailId: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            cartId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'carts',
                    key: 'cartId',
                },
                onDelete: 'CASCADE',
            },
            variantId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'variants',
                    key: 'variantId',
                },
                onDelete: 'CASCADE',
            },
            quantity: {
                allowNull: false,
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('CartDetails');
    },
};
