'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const teachersId = await queryInterface.sequelize.query(
      'SELECT id FROM Teachers;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const categoriesId = await queryInterface.sequelize.query(
      'SELECT id FROM Categories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )

    await queryInterface.bulkInsert(
      'CategoryTeachers',
      Array.from({ length: 20 }, () => ({
        teacher_id:
          teachersId[Math.floor(Math.random() * teachersId.length)].id,
        category_id:
          categoriesId[Math.floor(Math.random() * categoriesId.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      })
      ))
    // 刪除重複的列資料
    await queryInterface.sequelize.query(`DELETE FROM CategoryTeachers WHERE id NOT IN (SELECT id
    FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY teacher_id,category_id ORDER BY id) AS row_num
        FROM CategoryTeachers
    ) AS t
    WHERE row_num = 1
   )`)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CategoryTeachers', {})
  }
}
