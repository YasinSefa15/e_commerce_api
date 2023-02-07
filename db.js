const mysql = require("mysql");
const dotenv = require('dotenv')
dotenv.config()

const mysqlDb = mysql.createConnection({
    host: process.env.mysql_HOST || "localhost",
    user: process.env.mysql_USER || "root",
    password: process.env.mysql_PASSWORD || "root",
    database: process.env.mysql_DATABSE || "database_name"
});

mysqlDb.connect(err => {
    if(err) {
        console.log(err)
    }
    else{
        console.log("Database connection is successful")
    }
});

module.exports = mysqlDb;