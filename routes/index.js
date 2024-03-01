const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const routeErrorHandler = require('../middlewares/errorHandler')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const { signInAuthenticate } = require('../middlewares/auth')
const teacher = require('./teacher')
const student = require('./student')
const classes = require('./classes')
const { authenticated } = require('../middlewares/auth')

router.post('/signup', userController.signup)
router.post('/signin', signInAuthenticate, userController.signin)
router.use('/teachers', authenticated, teacher)
router.use('/students', authenticated, student)
router.use('/classes', authenticated, classes)
router.post(
  '/categories/:teacherId',
  authenticated,
  categoryController.postCategories
)
router.get(
  '/comments/:teacherId',
  authenticated,
  commentController.getComments
)
router.post(
  '/comments/:teacherId',
  authenticated,
  commentController.postComment
)

router.use(routeErrorHandler)
module.exports = router
