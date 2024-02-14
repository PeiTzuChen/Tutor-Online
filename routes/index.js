const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const errorHandler = require('../middlewares/errorHandler')
router.post('/signup', userController.signup)
router.use(errorHandler)
module.exports = router
