const mysql = require("mysql")

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123123",
  database: "medicalManagement"
})

exports.connection = connection