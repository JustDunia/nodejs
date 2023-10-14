const User = require('./schemas/user')

const createUser = async user => user.save()

const getUserById = async id => User.findOne({ _id: id })

const getUserByEmail = async email => User.findOne({ email: email })

const addToken = async (email, token) => User.findOneAndUpdate({ email: email }, { token: token })

const removeToken = async id => User.findByIdAndUpdate({ _id: id }, { token: null })

const changeSubscription = async (id, sub) =>
	User.findByIdAndUpdate({ _id: id }, { subscription: sub }, { new: true, runValidators: true })

const changeAvatar = async (id, url) =>
	User.findByIdAndUpdate({ _id: id }, { avatarURL: url }, { new: true, runValidators: true })

module.exports = {
	createUser,
	getUserByEmail,
	addToken,
	removeToken,
	getUserById,
	changeSubscription,
	changeAvatar,
}
