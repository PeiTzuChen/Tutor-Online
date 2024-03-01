const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const routeErrorHandler = require('../middlewares/errorHandler')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const classController = require('../controllers/classController')
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
router.get(
  '/classes/teacherBooked/:id',
  authenticated,
  classController.getTeacherClasses
)
router.get(
  '/classes/studentBooked/:id',
  authenticated,
  classController.getStudentClasses
)
router.get(
  '/classes/:teacherId',
  authenticated,
  classController.getCreatedClasses
)
router.patch(
  '/classes/:teacherId',
  authenticated,
  classController.patchClasses
)
router.post(
  '/classes',
  authenticated,
  classController.postClass
)
router.delete(
  '/classes/:id',
  authenticated,
  classController.deleteClass
)
router.use(routeErrorHandler)
module.exports = router
