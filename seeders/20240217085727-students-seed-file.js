'use strict'
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Students',
      Array.from({ length: 20 }, () => ({
        name: faker.person.fullName(),
        introduction: faker.lorem.paragraphs(),
        avatar: faker.image.avatar(),
        total_learning_time: Math.floor((Math.random() * 1000 + 1)),
        created_at: new Date(),
        updated_at: new Date()
      })),
      {}
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Students', {})
  }
}
