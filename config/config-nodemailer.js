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
		from: MAILER_USER,
		to: email,
		subject: 'Account verification',
		html: `To finish the registration process, please click the button to verify your email address.<br><button><a href="${verificationLink}">VERIFY</a></button>`,
	}

	transporter
		.sendMail(emailOptions)
		.then(info => console.log(info))
		.catch(err => console.log(err))
}

module.exports = sendEmail
