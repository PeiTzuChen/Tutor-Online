const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const routeErrorHandler = require('../middlewares/errorHandler')
const categoryController = require('../controllers/categoryController')
const { signInAuthenticate } = require('../middlewares/auth')
const teacher = require('./teacher')
const student = require('./student')
const { authenticated } = require('../middlewares/auth')

router.post('/signup', userController.signup)
router.post('/signin', signInAuthenticate, userController.signin)
router.use('/teachers', authenticated, teacher)
router.use('/students', authenticated, student)
router.post(
  '/categories/:teacherId',
  authenticated,
  categoryController.postCategories
)

router.use(routeErrorHandler)
module.exports = router
