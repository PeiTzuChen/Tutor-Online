const studentServices = require('../services/studentServices')

const studentController = {
  getStudents: (req, res, next) => {
    studentServices.getStudents(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  getStudent: (req, res, next) => {
    studentServices.getStudent(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  postStudent: (req, res, next) => {
    studentServices.postStudent(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  putStudent: (req, res, next) => {
    studentServices.putStudent(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  }
}

module.exports = studentController
