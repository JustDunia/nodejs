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
	const userId = req.user._id
	const { favorite, page, limit } = req.query
	let allContacts = []
	try {
		if (!favorite) {
			allContacts =
				!page || !limit
					? await service.getAllContacts(userId)
					: await service.getContactsWithPagination(userId, req.query.page, req.query.limit)
		} else {
			allContacts =
				!page || !limit
					? await service.getAllFavoriteContacts(userId, favorite)
					: await service.getFavoriteContactsWithPagination(
							userId,
							favorite,
							req.query.page,
							req.query.limit
					  )
		}

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
	const userId = req.user._id
	const { contactId } = req.params
	try {
		const contact = await service.getContactById(contactId, userId)

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

const create = async (req, res, next) => {
	const owner = req.user._id
	const { name, email, phone } = req.body

	const validationResult = addSchema.validate({
		name: name,
		email: email,
		phone: phone,
	})

	if (!validationResult.error) {
		try {
			const contact = await service.createContact({ name, email, phone, owner })

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
	const userId = req.user._id
	const { contactId } = req.params
	try {
		const contact = await service.removeContact(contactId, userId)

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
	const userId = req.user._id
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
			const contact = await service.updateContact(contactId, body, userId)

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
	const userId = req.user._id
	const { contactId } = req.params
	const { favorite } = req.body
	if (favorite === undefined)
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: 'missing field favorite',
		})

	try {
		const contact = await service.updateStatusContact(contactId, favorite, userId)
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
	create,
	remove,
	modify,
	setFavourite,
}
