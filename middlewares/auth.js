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
    req.user = user
    return next()
  })(req, res, next)
}

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      const err = new Error("JWT doesn't exist or is wrong")
      return next(err)
    }
    if (user.isAdmin) {
      return res.status(403)
        .json({ status: 'error', message: 'permission denied' })
    }
    delete user.password
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
      const err = new Error("JWT doesn't exist or is wrong")
      return next(err)
    }
    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ status: 'error', message: 'permission denied' })
    }
    delete user.password
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = {
  signInAuthenticate,
  authenticated,
  authenticatedAdmin
}
