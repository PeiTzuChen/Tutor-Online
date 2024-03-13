const multer = require('multer')
const path = require('path')
const upload = multer({
  dest: path.join(__dirname, '../temp/'),
  fileFilter (req, file, cb) {
    // 只接受三種圖片格式
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      const err = new Error('Only jpg, png, jpeg permitted')
      err.status = 400
      err.name = 'Client error'
      cb(err)
    }
    cb(null, true)
  }
}).single('avatar')

const uploadImage = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return next(err)
    return next()
  })
}
module.exports = uploadImage
