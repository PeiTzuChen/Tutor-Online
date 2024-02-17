const db = require('../models')
const { Teacher } = db

const teacherServices = {

  getTeachers: (req, cb) => {
    Teacher.findAll({ raw: true })
      .then(teachers => {
        if (teachers.length < 1) {
          const err = new Error('no teachers data')
          err.status = 404
          throw err
        }
        return cb(null, teachers)
      }).catch(err => cb(err))
  }

}

module.exports = teacherServices
