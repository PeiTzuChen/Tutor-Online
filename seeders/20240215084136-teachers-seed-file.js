'use strict'
const { faker } = require('@faker-js/faker')
const countryName = ['歐洲', '美國', '澳洲', '加拿大']
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Teachers',
      Array.from({ length: 10 }, () => ({
        name: faker.person.fullName(),
        country: countryName[Math.floor(Math.random() * 4)],
        introduction: faker.lorem.paragraphs(),
        style: faker.lorem.paragraphs(),
        // avatar: faker.image.avatar(),
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
