const mysql = require('../mysql/mysqlConfig')
const crypto = require('./crypto')
const serect = require('./serect')
const md5 = require('./md5')
exports.queryUsername = username => {
  return new Promise((resolve, reject) => {
    let sqlcommand = `select * from userInfo where username = '${username}'`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      if (rows.length > 0) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}

exports.registerStore = data => {
  return new Promise((resolve, reject) => {
    let sqlcommand = `insert into userInfo(username,password,birth,type) value('${data.username}','${data.password}','${data.birth}','${data.userType}')`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve()
    })
  })
}

exports.queryLogin = data => {
  return new Promise((resolve, reject) => {
    if (!data.hasOwnProperty('username')) { // 判断用户是否只携带Token
      let tokenArray = (data.token).split('.')
      let tokenPayload = tokenArray[1]
      let username = (JSON.parse(Buffer.from(tokenPayload, 'base64').toString())).name
      data.username = username
    }
    let sqlcommand = `select * from userInfo where username = '${data.username}'`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        console.log(error)
        throw Error
      }
      if (rows.length === 1 && data.password && rows[0].password === md5(md5(data.password).substring(0, 10)) && rows[0].type === data.userType) {
        if (!data.hasOwnProperty('token') || rows[0].serect === '') { // 用户在新设备登陆或第一次登陆
          let token = updateToken(data)
          resolve({
            name: data.username,
            typ: data.userType,
            token
          })
        } else {
          let now = ((new Date()).getTime())
          let tokenArray = (data.token).split('.')
          let [tokenHeader, tokenPayload, tokenSignature] = tokenArray
          let algorithm = (JSON.parse(Buffer.from(tokenHeader, 'base64').toString())).alg
          let payload = (JSON.parse(Buffer.from(tokenPayload, 'base64').toString()))
          let { exp, name, typ } = payload
          let signature = crypto(`${tokenHeader}.${tokenPayload}${rows[0].serect}`, algorithm)
          if (tokenSignature === signature && now < exp) { // 判断用户提供的Token是否合法
            resolve({
              name,
              typ,
              true: true
            })
          } else {
            resolve(2)
          }
        }
      } else if (data.hasOwnProperty('token')) { // 用户只携带Token
        let now = ((new Date()).getTime())
        let tokenArray = (data.token).split('.')
        let [tokenHeader, tokenPayload, tokenSignature] = tokenArray
        let algorithm = (JSON.parse(Buffer.from(tokenHeader, 'base64').toString())).alg
        let payload = (JSON.parse(Buffer.from(tokenPayload, 'base64').toString()))
        let { exp, name, typ } = payload
        let signature = crypto(`${tokenHeader}.${tokenPayload}${rows[0].serect}`, algorithm)
        if (tokenSignature === signature && now < exp) { // 判断用户提供的Token是否合法
          resolve({
            name,
            typ,
            true: true
          })
        } else {
          resolve(2)
        }
      } else {
        resolve(false)
      }
    })
  })
}

exports.drugSearch = searchItem => {
  return new Promise((resolve, reject) => {
    if (searchItem === undefined) {
      searchItem = ''
    }
    let sqlcommand = `select * from drugs where name like '%${searchItem}%' or barCode like '%${searchItem}%'`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      if (rows.length === 0) {
        resolve(false)
      } else {
        let array = rows.map(item => {
          return {
            barCode: item.barCode,
            name: item.name,
            money: item.money,
            useDetail: item.useDetail,
            factory: item.factory,
            num: item.num.toString(),
            introduce: item.introduce
          }
        })
        resolve(array)
      }
    })
  })
}

exports.treatSave = treatData => {
  return new Promise((resolve, reject) => {
    let medicineDetail = treatData.medicineDetail.map(item => {
      return JSON.stringify(item)
    })
    let medicineDetailString = medicineDetail.join('+')
    if (treatData.leaveDay === '') {
      treatData.leaveDay = 0
    }
    let sqlcommand = `insert into treat(studentId,time,total,disease,diseaseDetail,medicineDetail,doctorId,leaveDay) value('${treatData.studentId}','${treatData.time}','${treatData.total}','${treatData.disease}','${treatData.diseaseDetail}','${medicineDetailString}','${treatData.doctorId}','${treatData.leaveDay}')`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve(true)
    })
  })
}

exports.updateDrugsNum = drugsDetail => {
  return new Promise((resolve, reject) => {
    drugsDetail.map(item => {
      let sqlcommand = `select * from drugs where barCode = '${item.barCode}'`
      mysql.connection.query(sqlcommand, (error, rows, fields) => {
        if (error) {
          throw Error
        }
        let num = parseInt(rows[0].num) - parseInt(item.howUsed)
        let sqlcommand2 = `update drugs set num = '${num}' where barCode = '${item.barCode}'`
        mysql.connection.query(sqlcommand2, (error2, rows2, fields2) => {
          if (error2) {
            throw Error
          }
        })
      })
    })
  })
}

exports.studentSearch = student => {
  return new Promise((resolve, reject) => {
    // console.log(student)
    let sqlcommand = ''
    if (student.hasOwnProperty('name')) {
      sqlcommand = `select * from studentInfo where name = '${student.name}'`
    } else {
      sqlcommand = `select * from studentInfo where studentId = '${student.studentId}'`
    }
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve(rows)
    })
  })
}

exports.updateStudentInfo = student => {
  return new Promise((resolve, reject) => {
    let {name, studentId, sex, age, depart} = student
    let sqlcommand = `update studentInfo set name = '${name}', studentId = '${studentId}', sex = '${sex}', age = '${age}', depart = '${depart}' where studentId = '${studentId}'`
    console.log(sqlcommand)
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve(true)
    })
  })
}

exports.searchStudentTreat = studentId => {
  return new Promise((resolve, reject) => {
    let sqlcommand = `select * from treat where studentId = '${studentId}'`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve(rows)
    })
  })
}

exports.insertDrugData = drugData => {
  return new Promise((resolve, reject) => {
    let sqlcommand = `insert into drugs(barCode,name,money,useDetail,factory,num,lastStorageTime,introduce) value('${drugData.barCode}','${drugData.name}','${drugData.money}','${drugData.useDetail}','${drugData.factory}','${drugData.inNum}','${drugData.storeTime}','${drugData.introduce}')`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve('insertComplete')
    })
  })
}

exports.updateDrugData = drugData => {
  if (!drugData) {
    console.error('参数错误')
    return
  }
  return new Promise((resolve, reject) => {
    let sqlcommand = `update drugs set name='${drugData.name}',money='${drugData.money}',useDetail='${drugData.useDetail}',factory='${drugData.factory}',num='${parseInt(drugData.inNum)}',lastStorageTime='${drugData.storeTime}',introduce='${drugData.introduce}' where barCode='${drugData.barCode}'`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve('updateComplete')
    })
  })
}

// type { String } in或者out in代表录入 out代表支出
// drugData {Object} 药物信息对象
// barCode name money num total 都要传入  录入药品对象要有inputer  使用药品对象要有user
exports.insertDrugFlow = (type, drugData) => {
  if (!type || !drugData) {
    console.error('请传入参数')
    return
  } else if (!(type === 'in' || type === 'out')) {
    console.error('type参数是in或者out')
    return
  }
  let sqlcommand = ''
  if (type === 'in') {
    sqlcommand = `insert into drugFlow(barCode,name,money,inTime,num,total,inputer) value('${drugData.barCode}','${drugData.name}','${drugData.money}','${new Date().toString()}','${drugData.num}','${drugData.total}','${drugData.inputer}')`
  } else if (type === 'out') {
    sqlcommand = `insert into drugFlow(barCode,name,money,outTime,num,total,user) value('${drugData.barCode}','${drugData.name}','${drugData.money}','${new Date().toString()}','${drugData.num}','${drugData.total}','${drugData.user}')`
  }
  // console.log(sqlcommand)
  return new Promise((resolve, reject) => {
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve(true)
    })
  })
}

// barCode { String } 条形码
exports.deleteDrugData = barCode => {
  if (!(barCode && typeof barCode === 'string')) {
    console.error('参数错误')
    return
  }
  return new Promise((resolve, reject) => {
    let sqlcommand = `delete from drugs where barCode='${barCode}'`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve(true)
    })
  })
}

// changeDoctorStatus
exports.changeDoctorStatus = (username, status) => {
  if (!(username !== '')) {
    console.error('参数错误')
  }
  return new Promise((resolve, reject) => {
    let sqlcommand = `update userInfo set status = '${status}' where username = '${username}'`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve(true)
    })
  })
}

// 1 坐诊中
// 2 休息中
// 3 下班了
// 12 坐诊中和休息中
exports.getDoctorStatus = status => {
  if (!status) return
  let sqlcommand = ''
  if (status === '12') {
    sqlcommand = `select * from userInfo where status = '1' or status = '2'`
  } else {
    sqlcommand = `select * from userInfo where status = ${status}`
  }
  return new Promise((resolve, reject) => {
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve(rows)
    })
  })
}

exports.getOneDoctorStatus = username => {
  if (!username) return
  let sqlcommand = `select status from userInfo where username = '${username}'`
  return new Promise((resolve, reject) => {
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve(rows)
    })
  })
}

exports.insertStudentInfo = data => {
  let sqlcommand = `insert into studentInfo(name,studentId,sex,age,depart) value('${data.name}','${data.studentCode}','${data.sex}','${data.age}','${data.depart}')`
  return new Promise((resolve, reject) => {
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      resolve(true)
    })
  })
}

function updateToken (data) {
  let now = new Date()
  let issued = (now.getTime()).toString()
  let expire = (now.getTime() + 10800000).toString() // 3小时
  let userserect = serect() // 用户私有id
  let signature = ''
  let header = {
    'typ': 'JWT', // Token类型
    'alg': 'sha256' // Token算法
  }
  let payload = {
    'iss': '广州大学华软软件学院', // 发行者
    'sub': '用户登陆', // 主题
    'iat': issued, // 发行时间
    'exp': expire, // 过期时间
    'name': data.username, // 名字
    'typ': data.userType // 类型
  }
  let headerBase64 = Buffer.from(JSON.stringify(header)).toString('base64')
  let payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64')
  let token = ''
  signature = crypto(`${headerBase64}.${payloadBase64}${userserect}`, header.alg)
  token = `${headerBase64}.${payloadBase64}.${signature}`
  let sqlcommand = `update userInfo set serect = '${userserect}' where username = '${data.username}'`
  mysql.connection.query(sqlcommand, (error, rows, fields) => {
    if (error) {
      throw Error
    }
  })
  return token
}
