const migration = require('mysql-migrations');
const mysql = require("mysql");
const dotenv = require('dotenv').config({path: __dirname + '/../.env'})


//to create migration file enter : node migration.js add migration create_table_users
//to migrate node migration.js up
//to refresh node migration.js refresh


const connection = mysql.createPool({
    connectionLimit: 10,
    host: process.env.mysql_HOST || "localhost",
    user: process.env.mysql_USER || "root",
    password: process.env.mysql_PASSWORD || "root",
    database: process.env.mysql_DATABSE || "database_name"
});


migration.init(connection, __dirname + '/migrations', function () {
    console.log("finished running migrations");
});