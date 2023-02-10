const express = require('express')
const api_routes = require("./routes/routes");
const rate_limiter = require("./middlewares/rate_limiter_middleware");
const {not_found} = require("./helpers/response_helper");
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use(rate_limiter)

//API routes with prefix /api
app.use('/api', api_routes)


//Undefined routes
app.use(function (req, res, next) {
    not_found(res)
})

app.listen(process.env.PORT, () => console.log(`Server running on port: http://${process.env.HOST}:${process.env.PORT}`))

