'use strict'
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

    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: 30 }, () => ({
        score: (Math.random() * 5).toFixed(1),
        text: faker.lorem.words(5),
        teacher_id:
          teachersId[Math.floor(Math.random() * teachersId.length)].id,
        student_id:
          studentsId[Math.floor(Math.random() * studentsId.length)].id,
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
