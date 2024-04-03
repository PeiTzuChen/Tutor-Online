const db = require('../models')
const { Teacher, Category, User, CategoryTeacher, Comment } = db
const { localFileHandler } = require('../helpers/file.helper')

const teacherServices = {
  // getTeachers: (req, cb) => {
  //   const { page } = req.query
  //   const { limit } = req.body
  //   Category.findAll({
  //     where: { id: [1, 3] },
  //     include: [
  //       {
  //         model: Teacher,
  //         as: 'teachersInCategory',
  //         where: {
  //           country: ['加拿大', '菲律賓']
  //         },
  //         attributes: [
  //           'id',
  //           'name',
  //           'country',
  //           'introduction',
  //           'style',
  //           'avatar'
  //         ]
  //       }
  //     ]
  //   })
  //     .then((categories) => {
  //       let teachersTotal = [] // 蒐集老師總筆數
  //       categories.forEach((element) => {
  //         const teachersInCategory = element.teachersInCategory.map(
  //           (teacher) => ({
  //             ...teacher.toJSON()
  //           })
  //         )
  //         teachersTotal = teachersTotal.concat(teachersInCategory)
  //       })
  //       if (teachersTotal.length < 1) {
  //         const err = new Error('No teachers data')
  //         err.status = 400
  //         err.name = 'error'
  //         throw err
  //       }
  //       // 刪除重複的老師資料
  //       for (let i = 0; i < teachersTotal.length; i++) {
  //         for (let j = i + 1; j < teachersTotal.length; j++) {
  //           if (teachersTotal[i].id === teachersTotal[j].id) {
  //             teachersTotal.splice(j, 1) // 刪除
  //           }
  //         }
  //         if (teachersTotal[i]) {
  //           delete teachersTotal[i].CategoryTeacher // 刪除物件多餘property
  //         }
  //       }
  //       const count = teachersTotal.length // 最後剩下總筆數
  //       const teacherLimit = teachersTotal.splice(
  //         (page - 1) * limit,
  //         page * limit
  //       ) // 第page頁，呈現limit筆的老師資料
  //       return cb(null, { count, teacherLimit })
  //     })
  //     .catch((err) => cb(err))
  // },
  getTeachers: (req, cb) => {
    const { page, limit } = req.query
    Teacher.findAll({
      include: [
        {
          model: Category,
          as: 'categoriesInTeacher'
        }
      ],
      attributes: ['id', 'name', 'country', 'introduction', 'style', 'avatar']
    })
      .then((teachers) => {
        if (teachers.length < 1) {
          return cb(null, 'doesn\'t have teachers data yet')
        } else {
          const result = teachers.map((teacher) => ({
            id: teacher.id,
            name: teacher.name,
            country: teacher.country,
            introduction: teacher.introduction,
            style: teacher.style,
            avatar: teacher.avatar,
            categories: teacher.categoriesInTeacher.map(
              (category) => category.id
            )
          }))
          const count = teachers.length // 總筆數
          const teacherLimit = result.splice((page - 1) * limit, page * limit) // 第page頁，呈現limit筆的老師資料
          return cb(null, { count, teacherLimit })
        }
      })
      .catch((err) => cb(err))
  },
  getTeacher: (req, cb) => {
    const id = req.params.id
    Teacher.findByPk(id, {
      include: [
        { model: Category, as: 'categoriesInTeacher' },
        { model: Comment }
      ]
    })
      .then((teacher) => {
        if (!teacher) {
          const err = new Error("The teacher doesn't exit")
          err.status = 400
          throw err
        }
        const commentCount = teacher.dataValues.Comments.length
        let commentAvg = 0
        teacher.dataValues.Comments.forEach(element => {
          commentAvg += element.toJSON().score
        })
        const teacherData = teacher.dataValues
        const result = {
          id: teacherData.id,
          name: teacherData.name,
          country: teacherData.country,
          introduction: teacherData.introduction,
          style: teacherData.style,
          avatar: teacherData.avatar,
          categoryId: teacherData.categoriesInTeacher.map(
            (category) => category.id
          ),
          ScoreAvg: commentCount ? (commentAvg / commentCount).toFixed(1) : null
        }
        return cb(null, result)
      })
      .catch((err) => cb(err))
  },
  postTeacher: (req, cb) => {
    const { name, country, introduction, style } = req.body
    if (req.user.teacherId) {
      const err = new Error('This account has been teacher already')
      err.status = 409
      throw err
    }
    if (!name) {
      const err = new Error("Teacher's name is required")
      err.status = 400
      throw err
    }
    const file = req.file
    const userId = req.user.id
    console.log('接到file', file)
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
        User.findByPk(userId)
          .then((user) =>
            user.update({ teacherId: teacher.id }))
          .then(user => cb(null, { teacher, user }))
      })
      .catch((err) => cb(err))
  },
  putTeacher: (req, cb) => {
    const teacherId = parseInt(req.user.teacherId)
    if (!teacherId) {
      const err = new Error('permission denied')
      err.status = 401
      throw err
    }
    const { name, country, introduction, style } = req.body
    const file = req.file
    return Promise.all([
      Teacher.findByPk(teacherId),
      localFileHandler(file),
      CategoryTeacher.destroy({ where: { teacherId } })
    ])
      .then(([teacher, filePath]) => {
        if (!teacher) {
          const err = new Error("The teacher doesn't exit")
          err.status = 400
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
