const express = require('express')
const router = express.Router()
const controller = require('../controller/contacts')

router.get('/', controller.getAll)
router.get('/:contactId', controller.getById)
router.post('/', controller.post)
router.delete('/:contactId', controller.remove)
router.put('/:contactId', controller.modify)
router.patch('/:contactId/favorite', controller.setFavourite)

module.exports = router
