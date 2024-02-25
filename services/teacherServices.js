const db = require('../models')
const { Teacher, Category, User } = db
const localFileHandler = require('../helpers/file.helper')
const teacherServices = {
  getTeachers: (req, cb) => {
    const { page } = req.query
    const { limit } = req.body
    Category.findAll({
      where: { name: ['生活英文', '旅遊英文'] },
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
            'avatar',
            'link'
          ]
        }
      ]
    })
      .then((categories) => {
        let teachersTotal = [] // 蒐集老師總筆數
        categories.forEach(element => {
          const teachersInCategory = element.teachersInCategory.map((teacher) => ({
            ...teacher.toJSON()
          }))
          teachersTotal = teachersTotal.concat(teachersInCategory)
        })

        // 刪除重複的老師資料
        for (let i = 0; i < teachersTotal.length; i++) {
          for (let j = i + 1; j < teachersTotal.length; j++) {
            if (
              teachersTotal[i].id === teachersTotal[j].id
            ) {
              teachersTotal.splice(j, 1) // 刪除
            }
          }
          if (teachersTotal[i]) {
            delete teachersTotal[i].CategoryTeacher // 刪除物件多餘property
          }
        }
        const count = teachersTotal.length // 最後剩下總筆數
        const teacherLimit = teachersTotal.splice((page - 1) * limit, page * limit) // 第page頁，呈現limit筆的老師資料
        return cb(null, { count, teacherLimit })
      })
      .catch((err) => cb(err))
  },
  getTeacher: (req, cb) => {
    const id = parseInt(req.params.id)
    Teacher.findByPk(id, {
      raw: true,
      nest: true
    })
      .then(teacher => {
        if (!teacher) {
          const err = new Error('The teacher doesn\'t exit')
          err.status = 400
          err.name = 'Client error'
          throw err
        }
        cb(null, teacher)
      }).catch(err => cb(err))
  },
  postTeachers: (req, cb) => {
    const { name, country, introduction, style, link } = req.body
    const file = req.file
    const userId = req.user.id

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

    localFileHandler(file)
      .then(filePath => {
        return Teacher.create({
          name,
          country,
          introduction,
          style,
          avatar: filePath || null,
          link
        })
      }).then(teacher => {
        User.findByPk(userId)
          .then(user =>
            user.update({ teacherId: teacher.id })
          )
        return cb(null, teacher)
      }).catch(err => cb(err))
  }

}

module.exports = teacherServices
