const db = require('../models')
const { Student, User } = db
const localFileHandler = require('../helpers/file.helper')
const studentServices = {
  getStudents: (req, cb) => {
    Student.findAll({ raw: true })
      .then((students) => {
        if (students.length < 1) {
          const err = new Error('no students data')
          err.status = 404
          throw err
        }
        return cb(null, students)
      })
      .catch((err) => cb(err))
  },
  postStudent: (req, cb) => {
    const { name, introduction } = req.body
    const file = req.file
    const userId = req.user.id

    if (req.user.studentId) {
      const err = new Error('This account has been student already')
      err.status = 409
      err.name = 'Client error'
      throw err
    }
    if (!name) {
      const err = new Error("student's name is required")
      err.status = 400
      err.name = 'Client error'
      throw err
    }

    localFileHandler(file)
      .then((filePath) => {
        return Student.create({
          name,
          introduction,
          avatar: filePath || null
        })
      })
      .then((student) => {
        User.findByPk(userId).then((user) =>
          user.update({ studentId: student.id })
        )
        return cb(null, student)
      })
      .catch((err) => cb(err))
  },
  putStudent: (req, cb) => {
    const { name, introduction } = req.body
    const file = req.file
    const id = parseInt(req.params.id)
    console.log(name)
    if (id !== req.user.studentId) {
      const err = new Error('permission denied')
      err.status = 401
      err.name = 'Client error'
      throw err
    }
    return Promise.all([Student.findByPk(id), localFileHandler(file)])
      .then(([student, filePath]) => {
        if (!student) {
          const err = new Error("The student doesn't exit")
          err.status = 400
          err.name = 'Client error'
          throw err
        }
        return student.update({
          name,
          introduction,
          avatar: filePath || undefined
        })
      })
      .then((student) => {
        return cb(null, student)
      })
      .catch((err) => cb(err))
  }
}

module.exports = studentServices
