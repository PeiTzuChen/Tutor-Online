'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      ...Array.from({ length: 5 }, () => ({
        email: faker.internet.exampleEmail(),
        password: bcrypt.hashSync('12345678', 10),
        is_admin: false,
        created_at: new Date(),
        updated_at: new Date()
      }))
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
}
