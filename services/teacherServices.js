const db = require('../models')
const { Teacher } = db

const teacherServices = {

  getTeachers: (req, cb) => {
    const name = req.query.name
    if (name) {
      Teacher.findAll({ where: { name }, raw: true, attributes: ['id', 'name', 'country', 'introduction', 'style', 'avatar', 'link'] })
        .then((teachers) => {
          if (teachers.length < 1) {
            const err = new Error("Can't find the teachers")
            err.status = 404
            throw err
          }
          return cb(null, teachers)
        })
        .catch((err) => cb(err))
    } else {
      Teacher.findAll({
        raw: true,
        attributes: [
          'id',
          'name',
          'country',
          'introduction',
          'style',
          'avatar',
          'link'
        ]
      })
        .then((teachers) => {
          if (teachers.length < 1) {
            const err = new Error('doesn\'t have teachers data')
            err.status = 404
            throw err
          }
          return cb(null, teachers)
        })
        .catch((err) => cb(err))
    }
  }

}

module.exports = teacherServices
