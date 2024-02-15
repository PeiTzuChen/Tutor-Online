const userServices = require('../services/userServices')
module.exports = {
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
    userServices.signin(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  }
}
