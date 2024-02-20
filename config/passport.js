const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
passport.session(false)
passport.use( // username && password 有值才會執行
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

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use( // Token有值且正確才會run
  new JwtStrategy(jwtOpts, (jwtPayload, cb) => {
    User.findByPk(jwtPayload.id)
      .then((user) => {
        return cb(null, user)
      })
      .catch((err) => {
        return cb(err)
      })
  })
)

// 使用req.logIn 一定要搭配以下兩個
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  cb(null, id)
})

module.exports = passport
