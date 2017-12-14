const express = require('express')
const app = express()

const router = require('./router/router')
app.use('/', router)

app.listen(3000)
