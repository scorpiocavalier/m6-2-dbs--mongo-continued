require('dotenv').config()
const { PORT } = process.env
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(require('./routes'))

app.listen(PORT, () => console.info(`Listening on port ${PORT}`))