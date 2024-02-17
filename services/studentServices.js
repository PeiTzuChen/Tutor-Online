const db = require('../models')
const { Student } = db

const studentServices = {

  getStudents: (req, cb) => {
    Student.findAll({ raw: true })
      .then(students => {
        if (students.length < 1) {
          const err = new Error('no students data')
          err.status = 404
          throw err
        }
        return cb(null, students)
      }).catch(err => cb(err))
  }

}

module.exports = studentServices
