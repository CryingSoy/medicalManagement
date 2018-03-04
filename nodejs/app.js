const express = require('express')
const app = express()

const router = require('./router/router')

const store = require('./model/store')

// 访问静态文件
app.use(express.static(__dirname + '/public/'))

const filter = [
  '/register',
  '/login'
]

const routerMap = {
  doctor: ['/drugSearch', '/treatSave', '/searchStudentTreat', '/studentSearch', '/saveDrugData', '/changeDrugData', '/deleteDrug', '/changeDoctorStatus'],
  student: ['/studentSearch', '/searchStudentTreat', '/updateStudentInfo', '/getDoctorStatus'],
  teacher: ['/getDoctorStatus', '/studentSearch']
}

// token中间件
app.use((req, res, next) => {
  console.log(req)
  if (filter.includes(req.path)) {
    next()
    return
  }
  const token = req.headers.authorization
  if (!token) {
    res.json({
      code: -1,
      msg: '登陆信息错误'
    })
    return
  }
  store.queryLogin({ token })
    .then(isCorrent => {
      if (!isCorrent.true) {
        res.json({
          code: -1,
          msg: 'token错误'
        })
      } else {
        if (routerMap[isCorrent.typ].includes(req.path)) {
          next()
        } else {
          res.json({
            code: -1,
            msg: '权限不足'
          })
        }
      }
    })
})

app.use('/', router)

app.listen(3000)
