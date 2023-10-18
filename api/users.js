const express = require('express')
const router = express.Router()
const usersController = require('../controller/users')
const auth = require('../config/config-passport')
const upload = require('../config/config-storage')

router.post('/signup', usersController.register)
router.post('/login', usersController.login)
router.get('/logout', auth, usersController.logout)
router.get('/current', auth, usersController.getCurrentUser)
router.patch('/avatars', [auth, upload.single()], usersController.changeAvatar)
router.patch('/', auth, usersController.setSubscription)
router.get('/verify/:verificationToken', usersController.verifyEmail)

module.exports = router
