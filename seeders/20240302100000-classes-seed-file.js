'use strict'
const dayjs = require('dayjs')
const { faker } = require('@faker-js/faker')
const { classLength } = require('../helpers/date.helper')
const time = ['18:00-18:30', '18:30-19:00', '19:00-19:30', '19:30-20:00', '20:00-20:30', '20:30-21:00', '18:00-19:00', '19:00-20:00', '20:00-21:00']
const day = Array.from({ length: 15 }, (_, i) =>
  dayjs().add(i, 'day').format('YYYY-MM-DD')
)
const uuidv4 = require('uuid').v4
const dateTimeRange = Array.from(
  { length: 30 },
  () =>
    `${day[Math.floor(Math.random() * day.length)]} ${
      time[Math.floor(Math.random() * time.length)]
    }`
)
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
    const categoriesId = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert(
      'Classes',
      Array.from({ length: 30 }, (_, i) => ({
        name: faker.person.fullName(),
        link: `https://tutoring-platform-becky.vercel.app/class/${uuidv4().slice(
          0,
          8
        )}`,
        date_time_range: dateTimeRange[i],
        length: classLength(dateTimeRange[i]),
        teacher_id:
          teachersId[Math.floor(Math.random() * teachersId.length)].id,
        student_id:
          studentsId[Math.floor(Math.random() * studentsId.length)].id,
        category_id:
          categoriesId[Math.floor(Math.random() * categoriesId.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      })),
      {}
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Classes', null, {})
  }
}
