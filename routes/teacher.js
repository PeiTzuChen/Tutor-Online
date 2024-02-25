const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacherController')
const uploadImage = require('../middlewares/multer')
router.get('/', teacherController.getTeachers)
router.get('/:id', teacherController.getTeacher)
router.post('/', uploadImage, teacherController.postTeacher)
router.put('/:id', uploadImage, teacherController.putTeacher)
module.exports = router
