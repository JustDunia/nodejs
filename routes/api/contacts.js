const contacts = require('../../models/contacts')

const express = require('express')

const router = express.Router()

const Joi = require('joi')
const addSchema = Joi.object({
	name: Joi.string().alphanum().min(2).max(30).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().pattern(new RegExp('[0-9]{8,13}')).required(),
})
const updateSchema = Joi.object({
	name: Joi.string().alphanum().min(2).max(30),
	email: Joi.string().email(),
	phone: Joi.string().pattern(new RegExp('[0-9]{8,13}')),
})

const validationMessage =
	'data validation error; name must contain between 2 and 30 alphanumeric characters; email must be a valid email address with @ sign and with 2 domain segments; phone must be a string containing 8 to 13 digits from 0 to 9'

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

	const validationResult = addSchema.validate({
		name: name,
		email: email,
		phone: phone,
	})
	if (!validationResult.error) {
		const contact = await contacts.addContact(req.body)

		res.status(201).json({
			status: 'success',
			code: 201,
			message: 'contact created',
			data: {
				contact,
			},
		})
	} else {
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: validationResult.error.message,
		})
	}
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
	const { name, email, phone } = body

	if (Object.keys(body).length === 0)
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: 'missing fields',
		})

	const validationResult = updateSchema.validate({
		name: name,
		email: email,
		phone: phone,
	})

	if (!validationResult.error) {
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
	} else {
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: validationResult.error.message,
		})
	}
})

module.exports = router
