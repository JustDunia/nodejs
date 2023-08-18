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
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
	},
	{ versionKey: false, timestamps: true }
)

const Contact = model('contacts', contacts)

module.exports = Contact
