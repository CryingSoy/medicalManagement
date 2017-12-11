const express = require('express')
const router = express.Router()

//处理表单提交
const formidable = require('formidable')
// mysql model
const store = require('../model/store')
// md5加密
const md5 = require('../model/md5')
// 访问静态文件
router.use(express.static(__dirname + '/public/'))

// 用户注册
router.post('/register', (req, res) => {
  const form = new formidable.IncomingForm()
  let json = {}
  form.parse(req, (err, data) => {
    if (err) {
      json.code = -1
      json.msg = '服务器错误'
      res.json(json)
    }
    console.log(data)
    let flag = false
    //用户名正则，4到10位（字母，数字，下划线，减号）
    let uPattern = /^[a-zA-Z0-9_-]{4,10}$/
    if (!uPattern.test(data.username)) {
      json.code = -1
      json.msg = '用户名格式错误'
      res.json(json)
    } else if (data.password === '' || data.password.length < 4 || data.password.length >16) {
      json.code = -1
      json.msg = '密码格式错误'
      res.json(json)
    } else if (data.birth === '') {
      json.code = -1
      json.msg = '生日格式错误'
      res.json(json)
    } else if (!(data.userType === 'doctor' || data.userType === 'student' || data.userType === 'teacher')) {
      json.code = -1
      json.msg = '用户类型格式错误'
      res.json(json)
    } else {
      flag = true
    }
    if (flag) {
      store.queryUsername(data.username)
      .then(isExist => {
        if (!isExist) {
          json.code = -1
          json.msg = '用户名已被注册'
          res.json(json)
        } else {
          // data.password = md5(data.password)
          store.registerStore(data).then(() => {
            json.code = 1
            json.msg = '注册成功'
            res.json(json)
          })
        }
      })
    }
  })
})

router.post('/login', (req, res) => {
  const form = new formidable.IncomingForm()
  let json = {}
  form.parse(req, (err, data) => {
    if (err) {
      json.code = -1
      json.msg = '服务器错误'
      res.json(json)
    }
    store.queryLogin(data)
    .then(isCorrent => {
      if (isCorrent === false) {
        json.code = -1
        json.msg = '用户名不存在或密码错误'
        res.json(json)
      } else if (isCorrent.true === true) {
        json.code = 1
        json.msg = 'Token验证正确，登陆成功'
        json.data = isCorrent
        res.json(json)
      } else if (isCorrent === 2) {
        json.code = -1
        json.msg = 'Token失效或不合法，请重新登陆'
        res.json(json)
      } else {
        json.code = 1
        json.msg = '登陆成功'
        json.data = isCorrent
        res.json(json)
      }
    })
  })
})

module.exports = router