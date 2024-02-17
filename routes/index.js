const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { routeErrorHandler } = require('../middlewares/errorHandler')
const { signInAuthenticate } = require('../middlewares/auth')
const teacher = require('./teacher')
router.post('/signup', userController.signup)
router.post('/signin', signInAuthenticate, userController.signin)
router.use('/teachers', teacher)

router.use(routeErrorHandler)
module.exports = router
