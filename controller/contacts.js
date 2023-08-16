const service = require('../service/contacts')
const Joi = require('joi')

const addSchema = Joi.object({
	name: Joi.string().alphanum().min(2).max(30).required(),
	email: Joi.string().email().required(),
	phone: Joi.string()
		.pattern(/[0-9]{8,13}/)
		.required(),
})
const updateSchema = Joi.object({
	name: Joi.string().alphanum().min(2).max(30),
	email: Joi.string().email(),
	phone: Joi.string().pattern(/[0-9]{8,13}/),
})

const getAll = async (req, res, next) => {
	try {
		const allContacts = await service.getAllContacts()
		res.json({
			status: 'success',
			code: 200,
			data: {
				allContacts,
			},
		})
	} catch (e) {
		console.error(e)
		next(e)
	}
}

const getById = async (req, res, next) => {
	const { contactId } = req.params
	try {
		const contact = await service.getContactById(contactId)

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
	} catch (e) {
		console.error(e)
		next(e)
	}
}

const post = async (req, res, next) => {
	const { name, email, phone } = req.body

	const validationResult = addSchema.validate({
		name: name,
		email: email,
		phone: phone,
	})

	if (!validationResult.error) {
		try {
			const contact = await service.createContact({ name, email, phone })

			res.status(201).json({
				status: 'success',
				code: 201,
				message: 'contact created',
				data: {
					contact,
				},
			})
		} catch (e) {
			console.error(e)
			next(e)
		}
	} else {
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: validationResult.error.message,
		})
	}
}

const remove = async (req, res, next) => {
	const { contactId } = req.params
	try {
		const contact = await service.removeContact(contactId)

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
	} catch (e) {
		console.error(e)
		next(e)
	}
}

const modify = async (req, res, next) => {
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
		try {
			const contact = await service.updateContact(contactId, body)

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
		} catch (e) {
			console.error(e)
			next(e)
		}
	} else {
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: validationResult.error.message,
		})
	}
}

const setFavourite = async (req, res, next) => {
	const { contactId } = req.params
	const { favorite } = req.body
	if (favorite === undefined)
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: 'missing field favorite',
		})

	try {
		const contact = await service.updateStatusContact(contactId, favorite)
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
	} catch (e) {
		console.error(e)
		next(e)
	}
}

module.exports = {
	getAll,
	getById,
	post,
	remove,
	modify,
	setFavourite,
}
