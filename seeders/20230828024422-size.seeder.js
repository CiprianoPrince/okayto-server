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
            'Sizes',
            await readJsonFile('./storage/data/sizes.json'),
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         */
        await queryInterface.bulkDelete('Sizes', null, {});
    },
};
