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
  signIn: (req, res, next) => {
    userServices.signIn(req, (err, token) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          user: req.user,
          token
        })
    })
  },
  GoogleSignIn: (req, res, next) => {
    userServices.GoogleSignIn(req, (err, token) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          user: req.user,
          token
        })
    })
  },
  getUsers: (req, res, next) => {
    userServices.getUsers(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  subMail: (req, res, next) => {
    userServices.subMail(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  },
  sendMail: (req, res, next) => {
    userServices.sendMail(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  }
}

module.exports = userController
