const express = require('express')
const api_routes = require("./routes/routes");
const dotenv = require('dotenv').config()


//You can get the mysql connection like that
//const con = require('./db')

const app = express()

app.use(express.json())
app.use(express.urlencoded())


app.use('/api', api_routes)


app.listen(process.env.port, () => console.log(`Server running on port: http://${process.env.host}:${process.env.port}`))

