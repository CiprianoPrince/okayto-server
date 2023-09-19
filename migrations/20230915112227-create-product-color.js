'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('ProductColors', {
            productColorID: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            productID: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'products',
                    key: 'productID',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            colorID: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'colors',
                    key: 'colorID',
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
        await queryInterface.dropTable('ProductColors');
    },
};
