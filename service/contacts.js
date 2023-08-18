const Contact = require('./schemas/contact')

const getAllContacts = async userId => Contact.find({ owner: userId })

const getContactsWithPagination = async (userId, page, limit) =>
	Contact.find({ owner: userId })
		.limit(limit)
		.skip((page - 1) * limit)

const getAllFavoriteContacts = async (userId, favorite) =>
	Contact.find({ owner: userId, favorite: favorite })

const getFavoriteContactsWithPagination = async (userId, favorite, page, limit) =>
	Contact.find({ owner: userId, favorite: favorite })
		.limit(limit)
		.skip((page - 1) * limit)

const getContactById = async (contactId, userId) =>
	Contact.findOne({ _id: contactId, owner: userId })

const createContact = async ({ name, email, phone, owner }) =>
	Contact.create({ name, email, phone, owner })

const updateContact = async (contactId, fields, userId) =>
	Contact.findOneAndUpdate({ _id: contactId, owner: userId }, fields, { new: true })

const updateStatusContact = async (contactId, favorite, userId) =>
	Contact.findOneAndUpdate({ _id: contactId, owner: userId }, { favorite: favorite }, { new: true })

const removeContact = async (contactId, userId) =>
	Contact.findOneAndRemove({ _id: contactId, owner: userId })

module.exports = {
	getAllContacts,
	getContactById,
	removeContact,
	createContact,
	updateContact,
	getContactsWithPagination,
	updateStatusContact,
	getAllFavoriteContacts,
	getFavoriteContactsWithPagination,
}
