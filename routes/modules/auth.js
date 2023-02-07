const express = require("express");
const auth_controller = require('../../controllers/auth_controller')

const auth_router = express.Router()

//lists all the auths
auth_router.post('/', auth_controller.register)


module.exports = auth_router