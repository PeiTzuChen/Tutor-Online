'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Classes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      is_booked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_commented: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      name: {
        type: Sequelize.STRING
      },
      length: {
        type: Sequelize.INTEGER
      },
      date_time_range: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.STRING
      },
      student_id: {
        type: Sequelize.INTEGER
      },
      teacher_id: {
        type: Sequelize.INTEGER
      },
      category_id: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        timestamps: true
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Classes')
  }
}
