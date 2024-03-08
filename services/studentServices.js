const db = require('../models')
const { Student, User, sequelize } = db
const { localFileHandler } = require('../helpers/file.helper')
const studentServices = {
  getStudents: (req, cb) => {
    Student.findAll({ raw: true, order: [['totalLearningTime', 'DESC']] })
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
  getStudent: (req, cb) => {
    const id = req.params.id
    Student.findByPk(id, {
      attributes: { include: [[sequelize.literal('(SELECT row_num FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY total_learning_time DESC) AS row_num FROM Students) AS ranked_row WHERE id=11) '), 'rank']] }
    })
      .then((student) => {
        if (!student) {
          const err = new Error("The student doesn't exit")
          err.status = 400
          err.name = 'Client error'
          throw err
        }

        cb(null, student)
      })
      .catch((err) => cb(err))
  },
  postStudent: (req, cb) => {
    const { name, introduction } = req.body
    const file = req.file
    const userId = req.user.id

    // if (req.user.studentId) {
    //   const err = new Error('This account has been student already')
    //   err.status = 409
    //   err.name = 'Client error'
    //   throw err
    // }
    // if (!name) {
    //   const err = new Error("student's name is required")
    //   err.status = 400
    //   err.name = 'Client error'
    //   throw err
    // }

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
    console.log('接file', file)
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
        console.log('接filePath', filePath)
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
