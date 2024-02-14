const db = require('../models')
const { User } = db
const bcrypt = require('bcryptjs')
module.exports = {
  signup: (req, cb) => {
    const { email, password, passwordCheck } = req.body
    if (password !== passwordCheck) {
      const err = new Error('Password do not match!')
      err.status = 409
      err.name = 'Client error'
      throw cb(err)
    }
    if (!(email & password)) {
      const err = new Error('email or password is neccessary')
      err.status = 422
      err.name = 'Client error'
      throw cb(err)
    }
    User.findOne({
      where: { email }
    })
      .then((user) => {
        if (user) {
          const err = new Error('Email already exists!')
          err.status = 409
          err.name = 'Client error'
          throw err
        }
        return bcrypt.hash(password, 10)
      })
      .then((hash) => {
        return User.create({
          email,
          password: hash
        })
      })
      .then((user) => cb(null, user))
      .catch((err) => {
        return cb(err)
      })
  }
}
