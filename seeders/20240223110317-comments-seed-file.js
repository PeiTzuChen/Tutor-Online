'use strict'
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 20 }, () => ({
        score: (Math.random() * 5).toFixed(1),
        text: faker.lorem.words(5),
        created_at: new Date(),
        updated_at: new Date()
      })),
      {}
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', null, {})
  }
}
