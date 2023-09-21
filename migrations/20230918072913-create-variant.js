'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Variants', {
            variantId: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            productColorId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'productcolors',
                    key: 'productColorId',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            sizeId: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'sizes',
                    key: 'sizeId',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
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
        await queryInterface.dropTable('Variants');
    },
};
