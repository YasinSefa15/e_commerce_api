const express = require("express");
const user_router = require("./Modules/user.js");
const auth_router = require("./modules/auth");

const router = express.Router()

const api_routes = router
    .get('/', function (req, res) {
        res.send("Successful API route")
    })
    .use('/auth', auth_router)
    .use('/users', user_router)


module.exports = api_routes