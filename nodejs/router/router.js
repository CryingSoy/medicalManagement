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

router.post('/drugSearch', (req, res) => {
  const form = new formidable.IncomingForm()
  let json = {}
  form.parse(req, (err, data) => {
    store.drugSearch(data.searchItem)
    .then(searchResult => {
      if (searchResult === false) {
        json.code = -1
        if (data.searchItem === undefined) {
          json.msg = '未搜索到相关的结果'
        } else {
          json.msg = `未搜索到与"${data.searchItem}"相关的结果`
        }
        res.json(json)
      } else {
        json.code = 1
        json.msg = `搜索到${searchResult.length}条结果`
        json.data = searchResult
        res.json(json)
      }
    })
  })
})

router.post('/treatSave', (req, res) => {
  const form = new formidable.IncomingForm()
  let json = {}
  form.parse(req, (err, data) => {
    // console.log(data)
    store.treatSave(data)
    .then(isSaveSuccess => {
      if (isSaveSuccess) {
        json.code = 1
        json.msg = '就诊信息存储成功'
        res.json(json)
      }
    })
  })
})

router.post('/searchStudentTreat', (req, res) => {
  const form = new formidable.IncomingForm()
  let json = {}
  form.parse(req, (err, data) => {
    store.searchStudentTreat(data.studentId)
    .then(studentTreat => {
      if (studentTreat.length > 0) {
        json.code = 1
        json.msg = '学生就诊信息查询成功'
        json.data = studentTreat
        res.json(json)
      } else {
        json.code = -1
        json.msg = '未查询到就诊信息'
        res.json(json)
      }
    })
  })
})

router.post('/updateStudentInfo', (req, res) => {
  const form = new formidable.IncomingForm()
  let json = {}
  form.parse(req, (err, data) => {
    store.updateStudentInfo(data)
    .then(isUptate => {
      console.log(isUptate)
      if (isUptate) {
        json.code = 1
        json.msg = '学生就诊信息更新成功'
        res.json(json)
      } else {
        json.code = -1
        json.msg = '更新失败'
        res.json(json)
      }
    })
  })
})

router.post('/studentSearch', (req, res) => {
  const form = new formidable.IncomingForm()
  let json = {}
  form.parse(req, (err, data) => {
    store.studentSearch(data)
    .then(studentInfo => {
      console.log(studentInfo)
      if (studentInfo.length > 0) {
        json.code = 1
        json.msg = '学生信息查询成功'
        json.data = studentInfo
        res.json(json)
      } else {
        json.code = -1
        json.msg = '未查询到信息'
        res.json(json)
      }
    })
  })
})

router.post('/searchStudentTreat', (req, res) => {
  const form = new formidable.IncomingForm()
  let json = {}
  form.parse(req, (err, data) => {
    store.searchStudentTreat(data.studentId)
    .then(studentTreat => {
      if (studentTreat.length > 0) {
        json.code = 1
        json.msg = '学生就诊信息查询成功'
        json.data = studentTreat
        res.json(json)
      } else {
        json.code = -1
        json.msg = '未查询到就诊信息'
        res.json(json)
      }
    })
  })
})

router.post('/saveDrugData', (req, res) => {
  const form = new formidable.IncomingForm()
  let json = {}
  form.parse(req, (err, data) => {
    if (err) {
      console.log(err)
    }
    store.drugSearch(data.barCode).then(searchResult => {
      if (!searchResult) {
        return store.insertDrugData(data)
      } else {
        data.inNum = parseInt(data.inNum) + parseInt(searchResult[0].num)
        return store.updateDrugData(data)
      }
    }).then(flag => {
      if (flag === 'updateComplete') {
        json.code = 1
        json.msg = `药品信息更新、数量增加成功`
        res.json(json)
      } else if (flag === 'insertComplete') {
        json.code = 1
        json.msg = '药品录入成功'
        res.json(json)
      }
    })
    console.log(data)
  })
})

module.exports = router
