const express = require("express");
const user_router = require( "./Modules/user.js");

const router = express.Router()

const api_routes = router
    .get('/', function (req, res) {
        res.send("Successful API route")
    })
    .use('/users', user_router)


module.exports =  api_routes