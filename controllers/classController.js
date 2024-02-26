const classServices = require('../services/classServices')

const classController = {
  postClass: (req, res, next) => {
    classServices.postClass(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  }
}

module.exports = classController
