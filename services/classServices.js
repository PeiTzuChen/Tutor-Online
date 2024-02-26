const db = require('../models')
const { Class } = db

const classServices = {
  postClass: (req, cb) => {
    const { date, link } = req.body
    const length = parseInt(req.body.length)
    const teacherId = req.user.teacherId
    const categoryId = parseInt(req.body.category)

    if (!teacherId) { // 若不是老師，不能新增課程
      const err = new Error('permission denied')
      err.status = 401
      err.name = 'Client error'
      throw err
    }
    if (!(date && length && link)) { // 三個都要存在才能新增課程
      const err = new Error('Date, length and link of class are required')
      err.status = 400
      err.name = 'Client error'
      throw err
    }

    return Class.create({ date, link, length, teacherId, categoryId })
      .then(data => {
        console.log(data)
        cb(null, data)
      }).catch(err => cb(err))
  }
}

module.exports = classServices
