const express = require("express");
const auth_controller = require('../../controllers/auth_controller')

const auth_router = express.Router()

//lists all the auths
auth_router.post('/register', auth_controller.register)

auth_router.post('/login', auth_controller.login)


module.exports = auth_router