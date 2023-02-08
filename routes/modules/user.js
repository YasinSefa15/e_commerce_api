const express = require("express");
const user_controller = require('../../controllers/user_controller')

const user_router = express.Router()

//lists all the users
user_router.get('/', user_controller.read)


module.exports = user_router