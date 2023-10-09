const { default: mongoose } = require('mongoose')
const bCrypt = require('bcrypt')
const gravatar = require('gravatar')

const { Schema, model } = mongoose

const users = new Schema(
	{
		password: {
			type: String,
			required: [true, 'Password is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ['starter', 'pro', 'business'],
			default: 'starter',
		},
		token: {
			type: String,
			default: null,
		},
		avatarURL: {
			type: String,
			default: null,
		},
	},
	{ versionKey: false, timestamps: true }
)

users.methods.setPassword = function (password) {
	this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6))
}
users.methods.validatePassword = function (password) {
	return bCrypt.compareSync(password, this.password)
}
users.methods.generateAvatar = function (email) {
	this.avatarURL = gravatar.url(email, { protocol: 'http', s: '100' })
}

const User = model('users', users)

module.exports = User
