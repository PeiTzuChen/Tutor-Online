const db = require('../models')
const { Comment, Teacher } = db

const commentServices = {
  getComments: (req, cb) => {
    const teacherId = req.params.teacherId
    Comment.findAll({ raw: true, where: { teacherId } })
      .then((comments) => {
        if (comments.length < 1) {
          const err = new Error('no comments data')
          err.status = 404
          throw err
        }
        return cb(null, comments)
      })
      .catch((err) => cb(err))
  },
  postComment: (req, cb) => {
    const teacherId = parseInt(req.params.teacherId)
    const studentId = req.user.studentId
    const { text } = req.body
    const score = Number(req.body.score)

    if (!text) {
      const err = new Error('Text is required')
      err.status = 400
      throw err
    }
    return Promise.all([
      Teacher.findByPk(teacherId),
      Comment.findOne({ where: { studentId, teacherId } })
    ]).then(([teacher, comment]) => {
      if (comment) {
        const err = new Error('Comment already exists!')
        err.status = 400
        throw err
      }
      if (!teacher) {
        const err = new Error("Teacher didn't exist!")
        err.status = 400
        throw err
      }
      return Comment.create({
        text,
        score,
        studentId,
        teacherId
      })
    }).then(comment => {
      cb(null, comment)
    }).catch(err => cb(err))
  }

}

module.exports = commentServices
