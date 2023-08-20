const express = require('express')
const router = express.Router()
const contactsController = require('../controller/contacts')
const auth = require('../config/config-passport')

router.get('/', auth, contactsController.getAll)
router.get('/:contactId', auth, contactsController.getById)
router.post('/', auth, contactsController.create)
router.delete('/:contactId', auth, contactsController.remove)
router.put('/:contactId', auth, contactsController.modify)
router.patch('/:contactId/favorite', auth, contactsController.setFavourite)

module.exports = router
