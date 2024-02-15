const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (username, password, cb) => {
    User.findOne({ where: { email: username } })
      .then((user) => {
        if (!user) {
          const err = new Error('email or password is wrong')
          err.status = 401
          err.name = 'Client error'
          throw err
        }
        bcrypt
          .compare(password, user.password)
          .then((res) => {
            if (!res) {
              const err = new Error('email or password is wrong')
              err.status = 401
              err.name = 'Client error'
              throw err
            }
            return cb(null, user)
          })
          .catch((err) => cb(err))
      })
      .catch(err => cb(err))
  })
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

module.exports = passport
