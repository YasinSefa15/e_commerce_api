const mysql = require("mysql");
require('dotenv').config()

const mysqlDb = mysql.createConnection({
    host: process.env.mysql_HOST || "localhost",
    user: process.env.mysql_USER || "root",
    password: process.env.mysql_PASSWORD || "root",
    database: process.env.mysql_DATABSE || "database_name"
});

mysqlDb.connect(err => {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected as id ' + mysqlDb.threadId);
});

module.exports = mysqlDb;