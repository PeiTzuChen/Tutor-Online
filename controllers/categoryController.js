const categoryServices = require('../services/categoryServices')

const categoryController = {
  postCategories: (req, res, next) => {
    categoryServices.postCategories(req, (err, data) => {
      err
        ? next(err)
        : res.status(200).json({
          status: 'success',
          data
        })
    })
  }
}

module.exports = categoryController
