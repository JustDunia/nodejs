const nodemailer = require('nodemailer')
require('dotenv').config()

const USER = process.env.MAILER_USER
const PASS = process.env.MAILER_PASSWORD
const PORT = process.env.PORT

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: USER,
		pass: PASS,
	},
})

const sendEmail = (email, verificationToken) => {
	const verificationLink = `http://localhost:${PORT}/api/users/verify/${verificationToken}`
	const emailOptions = {
		from: 'dunixdunix832@gmail.com',
		to: email,
		subject: 'Rejestracja w serwisie',
		html: `Aby dokończyć rejestrację, zweryfikuj adres e-mail.<br><button><a href="${verificationLink}">POTWIERDŹ EMAIL</a></button>`,
	}

	transporter
		.sendMail(emailOptions)
		.then(info => console.log(info))
		.catch(err => console.log(err))
}

module.exports = sendEmail
