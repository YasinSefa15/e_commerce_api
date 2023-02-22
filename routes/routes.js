const express = require("express");
const user_router = require("./Modules/user.js");
const auth_router = require("./modules/auth");
const auth_middleware = require("../middlewares/auth_middleware");
const category_router = require("./modules/categories");

const router = express.Router()
const connection = require("../db");
const logger = require("../logs/logger");
const {MyError} = require("../helpers/error_by");

const api_routes = router
    .get('/', function (req, res) {
        res.send("Successful API route")
    })
    .use('/auth', auth_router)
    .use('/users', auth_middleware, user_router)
    .use('/categories', category_router)

module.exports = api_routes