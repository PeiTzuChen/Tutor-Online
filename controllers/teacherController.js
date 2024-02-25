const teacherServices = require('../services/teacherServices')

const teacherController = {
  getTeachers: (req, res, next) => {
    teacherServices.getTeachers(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  getTeacher: (req, res, next) => {
    teacherServices.getTeacher(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  postTeacher: (req, res, next) => {
    teacherServices.postTeacher(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  putTeacher: (req, res, next) => {
    teacherServices.putTeacher(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  }
}

module.exports = teacherController
