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
  getCompletedClasses: (req, res, next) => {
    classServices.getCompletedClasses(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  getTeacherClasses: (req, res, next) => {
    classServices.getTeacherClasses(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  getStudentClasses: (req, res, next) => {
    classServices.getStudentClasses(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  patchStudentClasses: (req, res, next) => {
    classServices.patchStudentClasses(req, (err, data) => {
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
  putClass: (req, res, next) => {
    classServices.putClass(req, (err, data) => {
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
