const express = require('express')
const router = express.Router()
const studentController = require('../controllers/studentController')
const uploadImage = require('../middlewares/multer')
router.get('/', studentController.getStudents)
router.post('/', uploadImage, studentController.postStudent)
router.put('/:id', uploadImage, studentController.putStudent)
module.exports = router
