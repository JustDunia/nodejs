const express = require('express')
const router = express.Router()
const contactsController = require('../controller/contacts')
const usersController = require('../controller/users')
const auth = require('../config/config-passport')

//  contacts
router.get('/', auth, contactsController.getAll)
router.get('/:contactId', auth, contactsController.getById)
router.post('/', auth, contactsController.create)
router.delete('/:contactId', auth, contactsController.remove)
router.put('/:contactId', auth, contactsController.modify)
router.patch('/:contactId/favorite', auth, contactsController.setFavourite)

//  users
router.post('/users/signup', usersController.register)
router.post('/users/login', usersController.login)
router.get('/users/logout', auth, usersController.logout)
router.get('/users/current', auth, usersController.getCurrentUser)
router.patch('/users', auth, usersController.setSubscription)

module.exports = router
