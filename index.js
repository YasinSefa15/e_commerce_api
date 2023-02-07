const express = require('express')
const api_routes = require("./routes/routes");
require('dotenv').config()

//You can get the mysql connection like that
//const con = require('./db')


const app = express()

app.use(express.json())
app.use(express.urlencoded())

//API routes with prefix /api
app.use('/api', api_routes)


app.listen(process.env.PORT, () => console.log(`Server running on port: http://${process.env.HOST}:${process.env.PORT}`))

