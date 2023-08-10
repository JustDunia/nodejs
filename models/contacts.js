const fs = require('fs/promises')
const path = require('path')
const { all } = require('../app')
const { v4: uuidv4 } = require('uuid')

const contactsPath = path.join(__dirname, 'contacts.json')

const listContacts = async () => {
	return fs
		.readFile(contactsPath)
		.then(contacts => JSON.parse(contacts))
		.catch(err => err.message)
}

const getContactById = async contactId => {
	const findContactInJson = contactsFromFile => {
		const contacts = JSON.parse(contactsFromFile)
		const index = contacts.findIndex(contact => contact.id === contactId)
		if (index === -1) {
			return null
		} else {
			return contacts[index]
		}
	}
	return fs
		.readFile(contactsPath)
		.then(contacts => findContactInJson(contacts))
		.catch(err => err.message)
}

const removeContact = async contactId => {
	const removeContactFromJson = contactsFromFile => {
		const contacts = JSON.parse(contactsFromFile)
		const index = contacts.findIndex(contact => contact.id === contactId)
		if (index === -1) {
			return null
		} else {
			const contact = contacts.splice(index, 1)
			fs.writeFile(contactsPath, JSON.stringify(contacts))
			return contact
		}
	}
	return fs
		.readFile(contactsPath)
		.then(contacts => removeContactFromJson(contacts))
		.catch(err => err.message)
}

const addContact = async body => {
	const addContactToJson = contactsFromFile => {
		const contact = { id: uuidv4(), ...body }
		const contacts = JSON.parse(contactsFromFile)
		contacts.push(contact)
		fs.writeFile(contactsPath, JSON.stringify(contacts))
		return contact
	}

	return fs
		.readFile(contactsPath)
		.then(contacts => addContactToJson(contacts))
		.catch(err => err.message)
}

const updateContact = async (contactId, body) => {
	const { name, email, phone } = body
	const updateContactInJson = contactsFromFile => {
		const contacts = JSON.parse(contactsFromFile)
		const [contact] = contacts.filter(contact => contact.id === contactId)
		if (!contact) {
			return null
		} else {
			contact.name = !name ? contact.name : name
			contact.email = !email ? contact.email : email
			contact.phone = !phone ? contact.phone : phone
			fs.writeFile(contactsPath, JSON.stringify(contacts))
			return contact
		}
	}
	return fs
		.readFile(contactsPath)
		.then(contacts => updateContactInJson(contacts))
		.catch(err => err.message)
}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
}
