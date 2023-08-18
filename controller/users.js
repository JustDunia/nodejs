require('dotenv').config()
const service = require('../service/users')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET
const User = require('../service/schemas/user')

const schema = Joi.object({
	password: Joi.string().min(8).max(30).required(),
	email: Joi.string().email().required(),
})

const register = async (req, res, next) => {
	const { email, password } = req.body

	const validationResult = schema.validate({
		email: email,
		password: password,
	})

	if (!validationResult.error) {
		try {
			const user = await service.getUserByEmail(email)
			if (user)
				return res.status(409).json({
					status: 'error',
					code: 409,
					message: 'Email is already in use',
				})

			const newUser = new User({ email })
			newUser.setPassword(password)
			const result = await service.createUser(newUser)
			res.status(201).json({
				status: 'success',
				code: 201,
				message: 'Registration successful',
				data: {
					user: { email: result.email, subscription: result.subscription },
				},
			})
		} catch (error) {
			next(error)
		}
	} else {
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: validationResult.error.message,
		})
	}
}

const login = async (req, res, next) => {
	const { email, password } = req.body

	const validationResult = schema.validate({
		email: email,
		password: password,
	})

	if (!validationResult.error) {
		try {
			const user = await service.getUserByEmail(email)
			if (!user || !user.validatePassword(password))
				res.status(401).json({
					status: 'error',
					code: 401,
					message: 'Email or password is wrong',
				})

			const payload = {
				id: user.id,
				email: user.email,
			}

			const token = jwt.sign(payload, SECRET, { expiresIn: '2h' })

			await service.addToken(email, token)

			res.status(200).json({
				status: 'success',
				code: 200,
				data: {
					token: token,
					user: { email: user.email, subscription: user.subscription },
				},
			})
		} catch (error) {
			next(error)
		}
	} else {
		return res.status(400).json({
			status: 'error',
			code: 400,
			message: validationResult.error.message,
		})
	}
}

const logout = async (req, res, next) => {
	const id = req.user.id
	try {
		await service.removeToken(id)
		res.status(204).send()
	} catch (error) {
		next(error)
	}
}

const getCurrentUser = async (req, res, next) => {
	const { email, subscription } = req.user
	res.status(200).json({
		status: 'success',
		code: 200,
		data: {
			email: email,
			subscription: subscription,
		},
	})
}

const setSubscription = async (req, res, next) => {
	const sub = req.body.subscription
	const id = req.user.id
	try {
		const user = await service.changeSubscription(id, sub)
		res.json({
			status: 'success',
			code: 200,
			message: 'subscription updated',
			data: {
				email: user.email,
				subscription: user.subscription,
			},
		})
	} catch (e) {
		console.error(e)
		next(e)
	}
}

module.exports = {
	register,
	login,
	logout,
	getCurrentUser,
	setSubscription,
}
