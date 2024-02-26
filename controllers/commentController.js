const commentServices = require('../services/commentServices')

const commentController = {
  getComments: (req, res, next) => {
    commentServices.getComments(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  postComment: (req, res, next) => {
    commentServices.postComment(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  }
}

module.exports = commentController
