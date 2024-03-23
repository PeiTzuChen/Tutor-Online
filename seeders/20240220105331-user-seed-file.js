'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const teachersId = await queryInterface.sequelize.query(
      'SELECT id FROM Teachers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const studentsId = await queryInterface.sequelize.query(
      'SELECT id FROM Students;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: await bcrypt.hash('12345678', 10),
        is_admin: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      ...Array.from({ length: 5 }, (_, i) => ({
        email: faker.internet.exampleEmail(),
        password: bcrypt.hashSync('12345678', 10),
        is_admin: false,
        teacher_id:
         i % 2 === 0 ? teachersId[Math.floor(Math.random() * teachersId.length)].id : null,
        student_id:
        studentsId[Math.floor(Math.random() * studentsId.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
}
