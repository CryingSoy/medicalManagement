const mysql = require("mysql")

const connection = mysql.createConnection({
  host: "112.74.211.89",
  user: "user",
  password: "123123",
  database: "medicalManagement"
})

exports.connection = connection