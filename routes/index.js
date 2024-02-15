const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const { routeErrorHandler } = require('../middlewares/errorHandler')
const { signInAuthenticate } = require('../middlewares/auth')

router.post('/signup', userController.signup)
router.post('/signin', signInAuthenticate)

router.use(routeErrorHandler)
module.exports = router
