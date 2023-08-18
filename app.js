const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const contactsRouter = require('./api/index')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
require('./config/config-passport')

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
	res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
})

app.use((err, req, res, next) => {
	res.status(500).json({ status: 'error', code: 500, message: err.message })
})

module.exports = app
