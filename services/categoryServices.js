const db = require('../models')
const { CategoryTeacher } = db

const categoryServices = {
  postCategories: (req, cb) => {
    const teacherId = parseInt(req.params.teacherId)
    if (teacherId !== req.user.teacherId) {
      const err = new Error('permission denied')
      err.status = 401
      err.name = 'Client error'
      throw err
    }
    const categoriesId = JSON.parse(req.body.categoryArray).map((category) =>
      parseInt(category)
    )

    return Promise.all(categoriesId.map(categoryId => {
      return CategoryTeacher.create({
        teacherId,
        categoryId
      })
    })
    ).then(data => {
      cb(null, data)
    }).catch(err => cb(err))
  }
}

module.exports = categoryServices
