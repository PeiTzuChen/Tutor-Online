const passport = require('../config/passport')
const signInAuthenticate = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      return next(err)
    }
    req.logIn(user, err => {
      if (err) next(err)
    })
    next()
  })(req, res, next)
}

module.exports = {
  signInAuthenticate
}
