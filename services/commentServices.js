const db = require('../models')
const { Comment, Teacher, Class } = db

const commentServices = {
  getComments: (req, cb) => {
    const teacherId = req.params.teacherId
    Comment.findAll({
      raw: true,
      where: { teacherId },
      order: [['updatedAt', 'DESC']]
    })
      .then((comments) => {
        comments.length < 1
          ? cb(null, "doesn't have comments data yet")
          : cb(null, comments)
      })
      .catch((err) => cb(err))
  },
  postComment: (req, cb) => {
    const teacherId = parseInt(req.params.teacherId)
    const studentId = req.user.studentId
    const { text, classId } = req.body
    const score = Number(req.body.score)

    if (!text) {
      const err = new Error('Text is required')
      err.status = 400
      throw err
    }
    return Promise.all([
      Teacher.findByPk(teacherId),
      Comment.findOne({ where: { studentId, teacherId } })
    ])
      .then(([teacher, comment]) => {
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
        Class.update(
          {
            isCommented: true
          },
          { where: { id: classId } }
        )
        return Comment.create({
          text,
          score,
          studentId,
          teacherId
        })
      })
      .then((comment) => {
        cb(null, comment)
      })
      .catch((err) => cb(err))
  },
  putComment: (req, cb) => {
    const commentId = req.params.commentId
    const { text } = req.body
    const score = Number(req.body.score)

    if (!text) {
      const err = new Error('Text is required')
      err.status = 400
      throw err
    }

    Comment.findByPk(commentId)
      .then((comment) => {
        if (!comment) {
          const err = new Error("Comment didn't exist!")
          err.status = 400
          throw err
        }
        return comment.update({
          text,
          score
        })
      })
      .then((comment) => {
        cb(null, comment)
      })
      .catch((err) => cb(err))
  }
}

module.exports = commentServices
