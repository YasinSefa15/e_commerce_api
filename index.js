const express = require('express')
const api_routes = require("./routes/routes");
const rate_limiter = require("./middlewares/rate_limiter_middleware");
require('dotenv').config()

//You can get the mysql connection like that
//const con = require('./db')


const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use(rate_limiter)

//API routes with prefix /api
app.use('/api', api_routes)


app.listen(process.env.PORT, () => console.log(`Server running on port: http://${process.env.HOST}:${process.env.PORT}`))

