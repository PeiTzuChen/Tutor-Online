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
  patchBookedClass: (req, res, next) => {
    classServices.patchBookedClass(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  patchClass: (req, res, next) => {
    classServices.patchClass(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  patchCompletedClass: (req, res, next) => {
    classServices.patchCompletedClass(req, (err, data) => {
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
  },
  getHistory: (req, res, next) => {
    classServices.getHistory(req, (err, data) => {
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
