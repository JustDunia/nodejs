const { default: mongoose } = require('mongoose')

const { Schema, model } = mongoose

const contacts = new Schema(
	{
		name: {
			type: String,
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
	},
	{ versionKey: false, timestamps: true }
)

const Contact = model('contacts', contacts)

module.exports = Contact
