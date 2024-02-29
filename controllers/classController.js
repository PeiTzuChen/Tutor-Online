const classServices = require('../services/classServices')

const classController = {
  getCreatedClasses: (req, res, next) => {
    classServices.getCreatedClasses(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  patchClasses: (req, res, next) => {
    classServices.patchClasses(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  postClass: (req, res, next) => {
    classServices.postClass(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  deleteClass: (req, res, next) => {
    classServices.deleteClass(req, (err, data) => {
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
