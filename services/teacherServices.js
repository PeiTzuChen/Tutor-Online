const db = require('../models')
const { Teacher, Category, User, CategoryTeacher } = db
const { localFileHandler } = require('../helpers/file.helper')
const teacherServices = {
  getTeachers: (req, cb) => {
    const { page } = req.query
    const { limit } = req.body
    Category.findAll({
      where: { id: [1, 3] },
      include: [
        {
          model: Teacher,
          as: 'teachersInCategory',
          where: {
            country: ['加拿大', '菲律賓']
          },
          attributes: [
            'id',
            'name',
            'country',
            'introduction',
            'style',
            'avatar'
          ]
        }
      ]
    })
      .then((categories) => {
        let teachersTotal = [] // 蒐集老師總筆數
        categories.forEach((element) => {
          const teachersInCategory = element.teachersInCategory.map(
            (teacher) => ({
              ...teacher.toJSON()
            })
          )
          teachersTotal = teachersTotal.concat(teachersInCategory)
        })
        if (teachersTotal.length < 1) {
          const err = new Error('No teachers data')
          err.status = 400
          err.name = 'Client error'
          throw err
        }
        // 刪除重複的老師資料
        for (let i = 0; i < teachersTotal.length; i++) {
          for (let j = i + 1; j < teachersTotal.length; j++) {
            if (teachersTotal[i].id === teachersTotal[j].id) {
              teachersTotal.splice(j, 1) // 刪除
            }
          }
          if (teachersTotal[i]) {
            delete teachersTotal[i].CategoryTeacher // 刪除物件多餘property
          }
        }
        const count = teachersTotal.length // 最後剩下總筆數
        const teacherLimit = teachersTotal.splice(
          (page - 1) * limit,
          page * limit
        ) // 第page頁，呈現limit筆的老師資料
        return cb(null, { count, teacherLimit })
      })
      .catch((err) => cb(err))
  },
  getTeacher: (req, cb) => {
    const id = req.params.id
    Teacher.findByPk(id, {
      include: { model: Category, as: 'categoriesInTeacher' }
    })
      .then((teacher) => {
        if (!teacher) {
          const err = new Error("The teacher doesn't exit")
          err.status = 400
          err.name = 'Client error'
          throw err
        }
        const teacherData = teacher.dataValues
        const result = {
          id: teacherData.id,
          name: teacherData.name,
          country: teacherData.country,
          introduction: teacherData.introduction,
          style: teacherData.style,
          avatar: teacherData.avatar,
          categoryId: teacherData.categoriesInTeacher.map((category) =>
            category.id)
        }
        cb(null, result)
      })
      .catch((err) => cb(err))
  },
  postTeacher: (req, cb) => {
    const { name, country, introduction, style } = req.body
    if (req.user.teacherId) {
      const err = new Error('This account has been teacher already')
      err.status = 409
      err.name = 'Client error'
      throw err
    }
    if (!name) {
      const err = new Error("Teacher's name is required")
      err.status = 400
      err.name = 'Client error'
      throw err
    }
    const file = req.file
    const userId = req.user.id

    localFileHandler(file)
      .then((filePath) => {
        return Teacher.create({
          name,
          country,
          introduction,
          style,
          avatar: filePath || null
        })
      })
      .then((teacher) => {
        const categories = JSON.parse(req.body.categoryArray).map(
          (categoryId) => ({
            teacherId: teacher.id,
            categoryId: parseInt(categoryId)
          })
        )
        CategoryTeacher.bulkCreate(categories)
        User.findByPk(userId).then((user) =>
          user.update({ teacherId: teacher.id })
        )
        return cb(null, teacher)
      })
      .catch((err) => cb(err))
  },
  putTeacher: (req, cb) => {
    const id = parseInt(req.params.id)
    if (id !== req.user.teacherId) {
      const err = new Error('permission denied')
      err.status = 401
      err.name = 'Client error'
      throw err
    }
    const { name, country, introduction, style } = req.body
    const file = req.file
    return Promise.all([
      Teacher.findByPk(id),
      localFileHandler(file),
      CategoryTeacher.destroy({ where: { teacherId: id } })
    ])
      .then(([teacher, filePath]) => {
        if (!teacher) {
          const err = new Error("The teacher doesn't exit")
          err.status = 400
          err.name = 'Client error'
          throw err
        }
        const categories = JSON.parse(req.body.categoryArray).map(
          (categoryId) => ({
            teacherId: teacher.id,
            categoryId: parseInt(categoryId)
          })
        )
        CategoryTeacher.bulkCreate(categories)
        return teacher.update({
          name,
          country,
          introduction,
          style,
          avatar: filePath || undefined
        })
      })
      .then((teacher) => {
        return cb(null, teacher)
      })
      .catch((err) => cb(err))
  }
}

module.exports = teacherServices
