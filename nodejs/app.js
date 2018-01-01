const express = require('express')
const app = express()

const router = require('./router/router')
// 访问静态文件
router.use('/', express.static(__dirname + '/public/'))
app.use('/', router)

app.listen(3000)
