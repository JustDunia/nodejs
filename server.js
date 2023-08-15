const app = require('./app')
const mongoose = require('mongoose')
require('dotenv').config()

const PORT = process.env.PORT || 3000
const URI = process.env.URI

const connection = mongoose.connect(URI, {
	useUnifiedTopology: true,
})

connection
	.then(() => {
		console.log('Database connection successful')
		app.listen(PORT, () => console.log(`Server running. Use our API on port: ${PORT}`))
	})
	.catch(err => {
		console.log(`Server not running. Error message: ${err.message}`)
		process.exit(1)
	})
