const userServices = require('../services/userServices')

const userController = {
  signup: (req, res, next) => {
    userServices.signup(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success'
        })
    })
  },
  signin: (req, res, next) => {
    userServices.signin(req, (err, token) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          user: req.user,
          token
        })
    })
  }
}

module.exports = userController
