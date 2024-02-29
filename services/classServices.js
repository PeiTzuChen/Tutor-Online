const db = require('../models')
const { Class } = db
const { isOverlapping, classLength } = require('../helpers/date.helper')

const classServices = {
  getCreatedClasses: (req, cb) => {
    const teacherId = parseInt(req.params.teacherId)
    const id = req.user.teacherId
    if (id !== teacherId) {
      const err = new Error('permission denied')
      err.status = 401
      throw err
    }
    Class.findAll({ raw: true, where: { teacherId } })
      .then((classes) => {
        if (classes.length < 1) {
          const err = new Error('no classes data')
          err.status = 404
          throw err
        }
        return cb(null, classes)
      })
      .catch((err) => cb(err))
  },
  patchClasses: (req, cb) => {
    const teacherId = req.params.teacherId
    const studentId = parseInt(req.user.studentId)
    const { dateTimeRange } = req.body
    // 不是學生不能預訂課程
    if (!studentId) {
      const err = new Error('permission denied')
      err.status = 401
      throw err
    }
    Class.findOne({ where: { teacherId, dateTimeRange } })
      .then(aClass => {
        if (!aClass) {
          const err = new Error('no class data')
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
      .then(aClass => cb(null, aClass))
      .catch(err => cb(err))
  },
  postClass: (req, cb) => {
    const { name, dateTimeRange, link } = req.body
    const teacherId = req.user.teacherId
    const categoryId = parseInt(req.body.category)

    if (!teacherId) {
      // 若不是老師，不能新增課程
      const err = new Error('permission denied')
      err.status = 401
      throw err
    }
    if (!(dateTimeRange && name && link)) {
      // 三個都要存在才能新增課程
      const err = new Error('Date, name and link of class are required')
      err.status = 400
      throw err
    }

    Class.findAll({ raw: true, where: { teacherId } })
      .then((classes) => {
        if (classes.length > 0) {
          const existDate = classes.map((aClass) => aClass.dateTimeRange)
          // 與資料庫存在課程逐一比對，有重疊回傳true
          const overlapping = existDate.map((existDate) =>
            isOverlapping(existDate, dateTimeRange)
          )
          if (overlapping.includes(true)) {
            const err = new Error('This class conflicts with other class')
            err.status = 400
            throw err
          }
        }

        const length = classLength(dateTimeRange)
        return Class.create({
          name,
          dateTimeRange,
          link,
          length,
          categoryId,
          teacherId
        })
      })
      .then((aClass) => {
        cb(null, aClass.toJSON())
      })
      .catch((err) => cb(err))
  },
  deleteClass: (req, cb) => {
    const id = req.params.id
    Class.findByPk(id)
      .then((aClass) => {
        if (!aClass) {
          const err = new Error("Class didn't exist!")
          err.status = 404
          throw err
        }
        return aClass.destroy()
      })

      .then((deletedClass) => cb(null, deletedClass))
      .catch((err) => cb(err))
  }
}

module.exports = classServices
