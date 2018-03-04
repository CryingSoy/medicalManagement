const express = require('express')
const router = express.Router()

//处理表单提交
const formidable = require('formidable')
// mysql model
const store = require('../model/store')
// md5加密
const md5 = require('../model/md5')

// 坐镇定时器
let treatTimer = null

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
    let flag = false
    if (false) {
      json.code = -1
      json.msg = '用户名格式错误'
      res.json(json)
    } else if (data.password === '' || data.password.length < 4 || data.password.length > 16) {
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
          data.password = md5(md5(data.password).substring(0, 10))
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
    store.updateDrugsNum(data.medicineDetail)
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
      // console.log(isUptate)
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
      // console.log(studentInfo)
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
        data.num = parseInt(data.inNum)
        data.inNum = parseInt(data.inNum) + parseInt(searchResult[0].num)
        data.total = data.inNum
        return store.updateDrugData(data)
      }
    }).then(flag => {
      if (flag === 'updateComplete') {
        json.code = 1
        json.msg = `药品信息更新、数量增加成功`
        return store.insertDrugFlow('in', data)
      } else if (flag === 'insertComplete') {
        json.code = 1
        json.msg = '药品录入成功'
        data.total = parseInt(data.num)
        return store.insertDrugFlow('in', data)
      }
    }).then(flag => {
      if (flag) {
        res.json(json)
      }
    })
    // console.log(data)
  })
})

router.post('/changeDrugData', (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, data) => {
    if (err) {
      console.log(err)
    }
    data.inNum = data.num
    store.updateDrugData(data).then(flag => {
      if (flag === 'updateComplete') {
        res.json({
          code: 1,
          msg: '药物信息更改完成'
        })
      }
    })
    // console.log(data)
  })
})

router.post('/deleteDrug', (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, { barCode }) => {
    if (err) {
      console.log(err)
    }
    let json = {}
    if (!barCode) {
      json.code = -1
      json.msg = '参数错误，请输入条形码'
      res.json(json)
    } else {
      store.deleteDrugData(barCode).then(flag => {
        if (flag) {
          json.code = 1
          json.msg = '药物信息已从数据库删除'
          res.json(json)
        }
      })
    }
  })
})

// 1坐镇中 2休息中 0下班了
router.post('/changeDoctorStatus', (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, { username, status, duration }) => {
    if (err) {
      console.log(err)
    }
    let json = {}
    if (!username) {
      json.code = -1
      json.msg = '参数错误，请输入username'
      res.json(json)
    } else {
      treatTimer = store.changeDoctorStatus(username, status).then(flag => {
        if (flag) {
          if (status === 0) {
            clearTimeout(treatTimer)
          } else {
            treatTimer = setTimeout(() => {
              store.changeDoctorStatus(username, 0)
            }, duration * 60000)
          }
          json.code = 1
          json.msg = '状态更改成功'
          res.json(json)
        } else {
          json.code = -1
          json.msg = '更改失败'
          res.json(json)
        }
      })
    }
  })
})

// 1 坐诊中
// 2 休息中
// 3 下班了
// 12 坐诊中和休息中
router.get('/getDoctorStatus', (req, res) => {
  store.getDoctorStatus(req.query.status).then(data => {
    res.json({
      code: 1,
      msg: `一共查询到${data.length}条信息`,
      data
    })
  })
})

// 参数 要查询的doctor的用户名
router.get('/getOneDoctorStatus', (req, res) => {
  store.getOneDoctorStatus(req.query.username).then(data => {
    res.json({
      code: 1,
      msg: `一共查询到${data.length}条信息`,
      data
    })
  })
})

router.post('/insertStudentInfo', (req, res) => {
  const form = new formidable.IncomingForm()
  form.parse(req, (err, data) => {
    if (err) {
      console.log(err)
    }
    store.insertStudentInfo(data).then(flag => {
      if (flag) {
        res.json({
          code: 1,
          msg: '添加学生信息成功'
        })
      }
    })
  })
})

module.exports = router
