const express = require('express')
const api_routes = require("./routes/routes");
const rate_limiter = require("./middlewares/rate_limiter_middleware");
const {not_found} = require("./helpers/response_helper");
const {connect, disconnect, client} = require('./redis')
const multer = require("multer");
const fs = require("fs");
require('dotenv').config()

connect().then(result => {
})


const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use(rate_limiter)

//API routes with prefix /api
app.use('/api', api_routes)

app.get('/public/uploads/:file_name', function (req, res) {
    if (fs.existsSync("public/uploads/" + req.params.file_name)) {
        res.sendFile(__dirname + '/public/uploads/' + req.params.file_name)
    } else {
        res.status(404).json({
            message: "File not found"
        })
    }
})

//Undefined routes
app.use(function (req, res, next) {
    not_found(res)
})
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        res.status(500).json({
            error: err.message,
            code: err.code
        })
    } else if (err) {
        // An unknown error occurred when uploading.
        res.status(500).json({
            error: err.message,
            code: err.code
        })
    }
})

app.listen(process.env.PORT, () => console.log(`Server running on port: http://${process.env.HOST}:${process.env.PORT}`))

