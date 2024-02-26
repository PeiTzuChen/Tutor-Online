const db = require('../models')
const { Comment } = db

const commentServices = {
  getComments: (req, cb) => {
    const teacherId = parseInt(req.params.teacherId)
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
  }
}

module.exports = commentServices
