'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Variants', {
            variantID: {
                primaryKey: true,
                allowNull: false,
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
            },
            productColorID: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'productcolors',
                    key: 'productColorID',
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            },
            sizeID: {
                allowNull: false,
                type: Sequelize.UUID,
                references: {
                    model: 'sizes',
                    key: 'sizeID',
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
