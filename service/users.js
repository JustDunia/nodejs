const User = require('./schemas/user')

const createUser = async user => user.save()

const getUserById = async id => User.findOne({ _id: id })

const getUserByEmail = async email => User.findOne({ email: email })

const addToken = async (email, token) => User.findOneAndUpdate({ email: email }, { token: token })

const removeToken = async id => User.findByIdAndUpdate({ _id: id }, { token: null })

const updateSubscription = async (id, sub) =>
	User.findByIdAndUpdate({ _id: id }, { subscription: sub }, { new: true, runValidators: true })

const updateAvatar = async (id, url) =>
	User.findByIdAndUpdate({ _id: id }, { avatarURL: url }, { new: true, runValidators: true })

const verifyEmail = async verificationToken =>
	User.findOneAndUpdate(
		{ verificationToken: verificationToken },
		{ verify: true, verificationToken: null }
	)

module.exports = {
	createUser,
	getUserByEmail,
	addToken,
	removeToken,
	getUserById,
	updateSubscription,
	updateAvatar,
	verifyEmail,
}
