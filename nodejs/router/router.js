const express = require('express')
const router = express.Router()

router.use(express.static(__dirname + '/public/'))

router.get('/test', (req, res) => {
  res.json({
    result: 'test'
  })
})

module.exports = router