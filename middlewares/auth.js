const passport = require('../config/passport')
const signInAuthenticate = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) {
      return next(err)
    }
    const userJSON = user.toJSON()
    req.logIn(userJSON, function (err) {
      if (err) {
        const err = new Error('user can\'t be written in req')
        return next(err)
      }
      return next()
    })
  })(req, res, next)
}

module.exports = {
  signInAuthenticate
}
