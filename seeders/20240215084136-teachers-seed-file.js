'use strict'
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Teachers',
      Array.from({ length: 20 }, () => ({
        name: faker.person.fullName(),
        country: faker.location.country(),
        introduction: faker.lorem.paragraphs(),
        style: faker.lorem.paragraphs(),
        avatar: faker.image.avatar(),
        link: faker.internet.url({ protocol: 'http', appendSlash: false }),
        created_at: new Date(),
        updated_at: new Date()
      })),
      {}
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teachers', {})
  }
}
