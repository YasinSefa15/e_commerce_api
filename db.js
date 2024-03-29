const mysql = require("mysql");
require('dotenv').config({path: __dirname + '/.env'})

const mysqlDb = mysql.createConnection({
    host: process.env.mysql_HOST || "localhost",
    user: process.env.mysql_USER || "root",
    password: process.env.mysql_PASSWORD || "root",
    database: process.env.mysql_DATABASE || "database_name",
    multipleStatements: true
});

mysqlDb.connect(err => {
    if (err) {
        //console.error('Error connecting: ' + err.stack);
        console.log("Error connecting to mysql database")
        return;
    }

    console.log('Connected as id ' + mysqlDb.threadId);
});

module.exports = mysqlDb;