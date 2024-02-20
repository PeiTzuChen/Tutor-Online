const express = require('express')
const router = express.Router()
const teacherController = require('../controllers/teacherController')
router.get('/', teacherController.getTeachers)

module.exports = router