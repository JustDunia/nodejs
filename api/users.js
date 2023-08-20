const express = require('express')
const router = express.Router()
const usersController = require('../controller/users')
const auth = require('../config/config-passport')

router.post('/signup', usersController.register)
router.post('/login', usersController.login)
router.get('/logout', auth, usersController.logout)
router.get('/current', auth, usersController.getCurrentUser)
router.patch('/', auth, usersController.setSubscription)

module.exports = router
