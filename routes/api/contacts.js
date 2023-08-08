const contacts = require('../../models/contacts')

const express = require('express')

const router = express.Router()

router.get('/', async (req, res, next) => {
	const allContacts = await contacts.listContacts()
	res.json({
		status: 'success',
		code: 200,
		data: {
			allContacts,
		},
	})
})

router.get('/:contactId', async (req, res, next) => {
	const { contactId } = req.params
	const contact = await contacts.getContactById(contactId)

	if (!contact)
		return res.status(404).json({
			status: 'error',
			code: 404,
			message: 'contact not found',
		})

	res.json({
		status: 'success',
		code: 200,
		data: {
			contact,
		},
	})
})

router.post('/', async (req, res, next) => {
	const { name, email, phone } = req.body

	if (!name || !email || !phone) {
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: 'missing required field; request body should contain name, email and phone',
		})
	}

	const contact = await contacts.addContact(req.body)
	res.status(201).json({
		status: 'success',
		code: 201,
		message: 'contact created',
		data: {
			contact,
		},
	})
})

router.delete('/:contactId', async (req, res, next) => {
	const { contactId } = req.params
	const contact = await contacts.removeContact(contactId)

	if (!contact)
		return res.status(404).json({
			status: 'error',
			code: 404,
			message: 'contact not found',
		})

	res.json({
		status: 'success',
		code: 200,
		message: 'contact deleted',
		data: {
			contact,
		},
	})
})

router.put('/:contactId', async (req, res, next) => {
	const { contactId } = req.params
	const body = req.body

	if (Object.keys(body).length === 0)
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: 'missing fields',
		})

	const contact = await contacts.updateContact(contactId, body)

	if (!contact)
		return res.status(404).json({
			status: 'error',
			code: 404,
			message: 'contact not found',
		})

	res.json({
		status: 'success',
		code: 200,
		message: 'contact updated',
		data: {
			contact,
		},
	})
})

module.exports = router
