const db = require('../models')
const { Class, Student, Teacher } = db
const {
  isOverlapping,
  classLength,
  withinWeek,
  classOrder
} = require('../helpers/date.helper')
const { redisRead } = require('../helpers/redis.helper')
const { Op } = require('sequelize')
const classServices = {
  getCreatedClasses: (req, cb) => {
    const teacherId = parseInt(req.params.teacherId)
    Class.findAll({ raw: true, where: { teacherId, isCompleted: false } })
      .then((classes) => {
        if (classes.length < 1) {
          return cb(null, "doesn't have classes data yet")
        } else {
          const twoWeekClass = classes.filter((aClass) => {
            // 確認是否近兩週內
            return withinWeek(aClass.dateTimeRange, 2) === true
          })
          const result = classOrder(twoWeekClass) // 按照課程先後順序排序
          return cb(null, result)
        }
      })
      .catch((err) => cb(err))
  },
  getCompletedClasses: (req, cb) => {
    const studentId = req.params.studentId
    Class.findAll({
      attributes: [
        'id',
        'length',
        'dateTimeRange',
        'name',
        'isCommented',
        'teacherId',
        'updatedAt'
      ],
      where: { studentId, isCompleted: true },
      include: { model: Teacher, attributes: ['name', 'avatar'] },
      order: [['updatedAt', 'DESC']]
    })
      .then((classes) => {
        if (classes.length < 1) {
          return cb(null, "doesn't have classes data yet")
        } else {
          const result = classes.map((aClass) => ({
            ...aClass.toJSON()
          }))
          return cb(null, result)
        }
      })
      .catch((err) => {
        cb(err)
      })
  },
  patchCompletedClass: (req, cb) => {
    const classId = req.params.classId
    Class.findByPk(classId)
      .then((aClass) => {
        if (!aClass) {
          const err = new Error("Class didn't exist!")
          err.status = 404
          throw err
        }
        if (aClass.isCompleted) {
          const err = new Error('This class has been completed before')
          err.status = 400
          throw err
        }
        const studentId = aClass.studentId
        Student.findByPk(studentId).then(
          student => {
            const totalLearningTime = student.totalLearningTime + aClass.length
            student.update({ totalLearningTime })
          }
        )
        return aClass.update({ isCompleted: true })
      })
      .then((aClass) => cb(null, aClass))
      .catch((err) => cb(err))
  },
  getTeacherClasses: (req, cb) => {
    const teacherId = req.params.id
    Class.findAll({
      raw: true,
      nest: true,
      attributes: ['id', 'length', 'dateTimeRange', 'name'],
      where: { teacherId, isBooked: true, isCompleted: false },
      include: { model: Student, attributes: ['name'] }
    })
      .then((classes) => {
        if (classes.length < 1) {
          return cb(null, "doesn't have classes data yet")
        } else {
          const oneWeekClass = classes.filter((aClass) => {
            // 確認是否近一週內
            return withinWeek(aClass.dateTimeRange, 1) === true
          })
          const result = classOrder(oneWeekClass) // 按照課程先後順序排序
          return cb(null, result)
        }
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
      attributes: ['id', 'length', 'dateTimeRange', 'name'],
      where: { studentId, isBooked: true, isCompleted: false },
      include: { model: Teacher, attributes: ['name'] }
    })
      .then((classes) => {
        if (classes.length < 1) {
          return cb(null, "doesn't have classes data yet")
        } else {
          const oneWeekClass = classes.filter((aClass) => {
            // 確認是否近一週內
            return withinWeek(aClass.dateTimeRange, 1) === true
          })
          const result = classOrder(oneWeekClass) // 按照課程先後順序排序

          return cb(null, result)
        }
      })
      .catch((err) => {
        cb(err)
      })
  },
  patchBookedClass: (req, cb) => {
    const classId = req.params.id
    Class.findByPk(classId)
      .then((aClass) => {
        if (!aClass) {
          const err = new Error("the class doesn't exist")
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
  patchClass: (req, cb) => {
    const teacherId = parseInt(req.params.teacherId)
    const studentId = parseInt(req.user.studentId)
    const { dateTimeRange } = req.body

    // 不是學生不能預訂課程,老師不能預訂自己的課
    if (!studentId || req.user.teacherId === teacherId) {
      const err = new Error('permission denied')
      err.status = 401
      throw err
    }

    Class.findAll({ raw: true, where: { studentId } })
      .then((classes) => {
        if (classes.length > 0) {
          const overlap = classes.some((aClass) => {
            return isOverlapping(aClass.dateTimeRange, dateTimeRange)
          })
          if (overlap) {
            const err = new Error(
              'Error: You already have class in this time!'
            )
            err.status = 400
            throw err
          }
        }
        return Class.findOne({ where: { teacherId, dateTimeRange } })
      })
      .then((aClass) => {
        if (!aClass) {
          const err = new Error("the class doesn't exist")
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
    // 確認自己是學生身份或是老師身份時會不會跟新增課程衝突
    Class.findAll({
      raw: true,
      where: {
        [Op.or]: [
          { studentId },
          { teacherId }
        ]
      }
    }).then(classes => {
      if (classes.length > 0) {
        const overlap = classes.some((aClass) => {
          return isOverlapping(aClass.dateTimeRange, dateTimeRange)
        })
        if (overlap) {
          const err = new Error(
            'This class conflicts with other class you booked or created'
          )
          err.status = 400
          throw err
        }
      }
      const length = classLength(dateTimeRange) // 同步ft
      return Class.create({
        name,
        dateTimeRange,
        length,
        categoryId,
        teacherId
      })
    }).then((aClass) => {
      cb(null, aClass.toJSON())
    })
      .catch((err) => cb(err))
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
  },
  getHistory: (req, cb) => {
    const { studentId, teacherId } = req.user
    const id = req.params.classId

    // 確認若是學生身份，有預訂此堂課，或者若是老師有開設此堂課，滿足其一就能看對話紀錄
    Promise.all([
      Student.findByPk(studentId, {
        include: { model: Class, where: { isBooked: 1, id } }
      }),
      Teacher.findByPk(teacherId, {
        include: { model: Class, where: { id } }
      })
    ]).then(([Sdata, Tdata]) => {
      if (!(Sdata || Tdata)) {
        const err = new Error('permission denied')
        err.status = 401
        throw err
      }
      return redisRead(id)
    })
      .then((chat) => {
        // 若沒找到或是那堂課沒使用聊天記錄
        const parsedData = chat.map((element) => JSON.parse(element))
        chat.length < 1
          ? cb(null, "doesn't have chat history")
          : cb(null, parsedData)
      })
      .catch((err) => cb(err))
  }
}

module.exports = classServices
