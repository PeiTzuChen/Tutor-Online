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
  }
}

module.exports = studentController
