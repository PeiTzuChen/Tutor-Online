const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { routeErrorHandler } = require('../middlewares/errorHandler')
const commentController = require('../controllers/commentController')
const {
  authenticated,
  signInAuthenticate,
  authenticatedAdmin
} = require('../middlewares/auth')
const teacher = require('./teacher')
const student = require('./student')
const classes = require('./classes')

router.post('/signup', userController.signup)
router.post('/signin', signInAuthenticate, userController.signIn)
router.post('/auth2/google', userController.GoogleSignIn)
router.get('/admin/users', authenticatedAdmin, userController.getUsers)
router.post(
  '/submail/:userId/send',
  authenticatedAdmin,
  userController.sendMail
)
router.post('/submail/:userId', authenticated, userController.subMail)
router.use('/teachers', authenticated, teacher)
router.use('/students', authenticated, student)
router.use('/classes', authenticated, classes)

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
router.put(
  '/comments/:commentId',
  authenticated,
  commentController.putComment
)

router.get('/test', (req, res, next) => {
  res.send('Hi hello')
})
router.use(routeErrorHandler)
module.exports = router
