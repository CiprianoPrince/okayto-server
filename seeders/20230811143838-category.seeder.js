'use strict';
const readJsonFile = require('../utils/readJsonFile');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         */
        await queryInterface.bulkInsert(
            'Categories',
            await readJsonFile('./storage/data/categories.json'),
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Categories', null, {});
    },
};
