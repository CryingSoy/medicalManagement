const mysql = require('../mysql/mysqlConfig')

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