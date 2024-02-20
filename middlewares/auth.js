const passport = require('../config/passport')
const signInAuthenticate = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      const err = new Error('email and password are required')
      err.status = 401
      err.name = 'Client error'
      return next(err)
    }
    const userJSON = user.toJSON()
    req.user = userJSON
    return next()
  })(req, res, next)
}

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      const err = new Error("JWT doesn't exist or is wrong")
      return next(err)
    }
    const userJSON = user.toJSON()
    req.user = userJSON
    return next()
  })(req, res, next)
}

module.exports = {
  signInAuthenticate,
  authenticated
}
