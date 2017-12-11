const mysql = require('../mysql/mysqlConfig')
const crypto = require('./crypto')
const serect = require('./serect')

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
    if (!data.hasOwnProperty('username')) { //判断用户是否只携带Token
      let tokenArray = (data.token).split('.')
      let tokenPayload = tokenArray[1]
      let username = (JSON.parse(new Buffer(tokenPayload, 'base64').toString())).name
      data.username = username
    }
    let sqlcommand = `select * from userInfo where username = '${data.username}'`
    mysql.connection.query(sqlcommand, (error, rows, fields) => {
      if (error) {
        throw Error
      }
      if (rows[0].password === data.password && rows[0].type === data.userType) {
        if (!data.hasOwnProperty('token') || '' === rows[0].serect) { //用户在新设备登陆或第一次登陆
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
          let algorithm = (JSON.parse(new Buffer(tokenHeader, 'base64').toString())).alg
          let payload = (JSON.parse(new Buffer(tokenPayload, 'base64').toString()))
          let { exp, name, typ } = payload
          let signature = crypto(`${tokenHeader}.${tokenPayload}${rows[0].serect}`, algorithm)
          if (tokenSignature === signature && now < exp) { //判断用户提供的Token是否合法
            resolve({
              name,
              typ,
              true: true
            })
          } else {
            resolve(2)
          }
        }
      } else if (data.hasOwnProperty('token')) { //用户只携带Token
        let now = ((new Date()).getTime())
        let tokenArray = (data.token).split('.')
        let [tokenHeader, tokenPayload, tokenSignature] = tokenArray 
        let algorithm = (JSON.parse(new Buffer(tokenHeader, 'base64').toString())).alg
        let payload = (JSON.parse(new Buffer(tokenPayload, 'base64').toString()))
        let { exp, name, typ } = payload
        let signature = crypto(`${tokenHeader}.${tokenPayload}${rows[0].serect}`, algorithm)
        if (tokenSignature === signature && now < exp) { //判断用户提供的Token是否合法
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

function updateToken(data) {
  let now = new Date()
  let issued = (now.getTime()).toString()
  let expire = (now.getTime() + 10800000).toString() //3小时
  let userserect = serect() //用户私有id
  let signature = ''
  let header = {
    "typ": "JWT", //Token类型
    "alg": "sha256" //Token算法
  }
  let payload = {
    "iss": "广州大学华软软件学院", //发行者
    "sub": "用户登陆", //主题
    "iat": issued, //发行时间
    "exp": expire, //过期时间
    "name": data.username, //名字
    'typ': data.userType, //类型
  }
  let headerBase64 = new Buffer(JSON.stringify(header)).toString('base64')
  let payloadBase64 = new Buffer(JSON.stringify(payload)).toString('base64')
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