const db = require('../models')
const { Class, Student, Teacher } = db
const {
  isOverlapping,
  classLength,
  withinWeek,
  classOrder
} = require('../helpers/date.helper')
const uuidv4 = require('uuid').v4
const baseURL = 'https://tutoring-platform-becky.vercel.app/classes/chat/'

const classServices = {
  getCreatedClasses: (req, cb) => {
    const teacherId = parseInt(req.params.teacherId)
    Class.findAll({ raw: true, where: { teacherId } })
      .then((classes) => {
        if (classes.length < 1) {
          return cb(null, "doesn't have classes data yet")
        }
        const twoWeekClass = classes.filter((aClass) => {
          // 確認是否近兩週內
          return withinWeek(aClass.dateTimeRange, 2) === true
        })
        const result = classOrder(twoWeekClass) // 按照課程先後順序排序

        return cb(null, result)
      })
      .catch((err) => cb(err))
  },
  getCompletedClasses: (req, cb) => {
    const studentId = req.params.studentId
    Class.findAll({
      attributes: ['length', 'dateTimeRange', 'name', 'updatedAt'],
      where: { studentId, isCompleted: true },
      include: { model: Teacher, attributes: ['name', 'avatar'] },
      order: [['updatedAt', 'DESC']]
    })
      .then((classes) => {
        if (classes.length < 1) {
          return cb(null, "doesn't have classes data yet")
        }
        const result = classes.map((aClass) => ({
          ...aClass.toJSON()
        }))
        return cb(null, result)
      })
      .catch((err) => {
        cb(err)
      })
  },
  getTeacherClasses: (req, cb) => {
    const teacherId = req.params.id
    Class.findAll({
      raw: true,
      nest: true,
      attributes: ['length', 'dateTimeRange', 'name', 'link'],
      where: { teacherId, isBooked: true },
      include: { model: Student, attributes: ['name'] }
    })
      .then((classes) => {
        if (classes.length < 1) {
          return cb(null, "doesn't have classes data yet")
        }
        const oneWeekClass = classes.filter((aClass) => {
          // 確認是否近一週內
          return withinWeek(aClass.dateTimeRange, 1) === true
        })
        const result = classOrder(oneWeekClass) // 按照課程先後順序排序
        return cb(null, result)
      })
      .catch((err) => {
        cb(err)
      })
  },
  getStudentClasses: (req, cb) => {
    const studentId = req.params.id
    Class.findAll({
      raw: true,
      nest: true,
      attributes: ['id', 'length', 'dateTimeRange', 'name', 'link'],
      where: { studentId, isBooked: true },
      include: { model: Teacher, attributes: ['name'] }
    })
      .then((classes) => {
        if (classes.length < 1) {
          return cb(null, "doesn't have classes data yet")
        }
        const oneWeekClass = classes.filter((aClass) => {
          // 確認是否近一週內
          return withinWeek(aClass.dateTimeRange, 1) === true
        })
        const result = classOrder(oneWeekClass) // 按照課程先後順序排序

        return cb(null, result)
      })
      .catch((err) => {
        cb(err)
      })
  },
  patchStudentClasses: (req, cb) => {
    const classId = req.params.id
    Class.findByPk(classId)
      .then((aClass) => {
        if (!aClass) {
          const err = new Error('the class doesn\'t exist')
          err.status = 404
          throw err
        }
        if (req.user.studentId !== aClass.studentId) {
          const err = new Error('permission denied')
          err.status = 401
          throw err
        }
        return aClass.update({ isBooked: false, studentId: null })
      })
      .then((unBookedClass) => cb(null, unBookedClass.toJSON()))
      .catch((err) => {
        cb(err)
      })
  },
  patchClasses: (req, cb) => {
    const teacherId = parseInt(req.params.teacherId)
    const studentId = parseInt(req.user.studentId)
    const { dateTimeRange } = req.body

    // 不是學生不能預訂課程,老師不能預訂自己的課
    if (!studentId || req.user.teacherId === teacherId) {
      const err = new Error('permission denied')
      err.status = 401
      throw err
    }
    Class.findOne({ where: { teacherId, dateTimeRange } })
      .then((aClass) => {
        if (!aClass) {
          const err = new Error('the class doesn\'t exist')
          err.status = 404
          throw err
        }
        if (aClass.isBooked) {
          const err = new Error('This class is booked!')
          err.status = 400
          throw err
        }
        return aClass.update({ isBooked: true, studentId })
      })
      .then((aClass) => cb(null, aClass))
      .catch((err) => cb(err))
  },
  postClass: (req, cb) => {
    const { name, dateTimeRange } = req.body
    const { studentId, teacherId } = req.user
    const categoryId = parseInt(req.body.category)

    if (!teacherId) {
      // 若不是老師，不能新增課程
      const err = new Error('permission denied')
      err.status = 401
      throw err
    }
    if (!(dateTimeRange && name)) {
      // 兩個都要存在才能新增課程
      const err = new Error('Date and name are required')
      err.status = 400
      throw err
    }

    // 確認老師開課時間是否與自己是學生身份的預定課程有衝突
    if (studentId) {
      Class.findAll({ raw: true, where: { studentId } })
        .then((classes) => {
          if (
            classes.some((aClass) => aClass.dateTimeRange === dateTimeRange)
          ) {
            const err = new Error(
              'This class conflicts with other class you booked as student'
            )
            err.status = 400
            throw err
          }
          // 若沒有衝突，則確認此時段是否已開課
          Class.findAll({ raw: true, where: { teacherId } })
            .then((classes) => {
              if (classes.length > 0) {
                const existDate = classes.map((aClass) => aClass.dateTimeRange)
                // 與資料庫存在課程逐一比對，有重疊回傳true
                const overlapping = existDate.map((existDate) =>
                  isOverlapping(existDate, dateTimeRange)
                )
                if (overlapping.includes(true)) {
                  const err = new Error(
                    'This class conflicts with other class you create as teacher'
                  )
                  err.status = 400
                  throw err
                }
              }
              const length = classLength(dateTimeRange)

              return Class.create({
                name,
                dateTimeRange,
                link: baseURL + uuidv4().slice(0, 8),
                length,
                categoryId,
                teacherId
              })
            })
            .then((aClass) => {
              cb(null, aClass.toJSON())
            })
            .catch((err) => cb(err))
        })
        .catch((err) => cb(err))
    } else {
      // 若不是學生身份，則確認此時段是否已開課
      Class.findAll({ raw: true, where: { teacherId } })
        .then((classes) => {
          if (classes.length > 0) {
            const existDate = classes.map((aClass) => aClass.dateTimeRange)
            // 與資料庫存在課程逐一比對，有重疊回傳true
            const overlapping = existDate.map((existDate) =>
              isOverlapping(existDate, dateTimeRange)
            )
            if (overlapping.includes(true)) {
              const err = new Error(
                'This class conflicts with other class you create as teacher'
              )
              err.status = 400
              throw err
            }
          }
          const length = classLength(dateTimeRange)

          return Class.create({
            name,
            dateTimeRange,
            link: baseURL + uuidv4().slice(0, 8),
            length,
            categoryId,
            teacherId
          })
        })
        .then((aClass) => {
          cb(null, aClass.toJSON())
        })
        .catch((err) => cb(err))
    }
  },
  putClass: (req, cb) => {
    const { name, dateTimeRange } = req.body
    const teacherId = req.user.teacherId
    const categoryId = parseInt(req.body.category)
    const classId = req.params.id
    if (!teacherId) {
      // 若不是老師，不能修改課程
      const err = new Error('permission denied')
      err.status = 401
      throw err
    }
    if (!(dateTimeRange && name)) {
      // 三個都要存在才能新增課程
      const err = new Error('Date and name are required')
      err.status = 400
      throw err
    }
    Class.findByPk(classId)
      .then((aClass) => {
        if (!aClass) {
          const err = new Error("Class didn't exist!")
          err.status = 404
          throw err
        }
        const length = classLength(dateTimeRange)

        return aClass.update({
          name,
          dateTimeRange,
          length,
          categoryId
        })
      })
      .then((aClass) => {
        cb(null, aClass)
      })
      .catch((err) => cb(err))
  },
  deleteClass: (req, cb) => {
    const id = req.params.id
    if (!req.user.teacherId) {
      const err = new Error('permission denied')
      err.status = 401
      throw err
    }
    Class.findByPk(id)
      .then((aClass) => {
        if (!aClass) {
          const err = new Error("Class didn't exist!")
          err.status = 404
          throw err
        }
        if (aClass.isCompleted) {
          const err = new Error("You can't delete a completed class")
          err.status = 400
          throw err
        }
        return aClass.destroy()
      })
      .then((deletedClass) => cb(null, deletedClass))
      .catch((err) => cb(err))
  }
}

module.exports = classServices
