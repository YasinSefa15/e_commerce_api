const express = require("express");
const cart_controller = require('../../controllers/cart_controller')

const cart_router = express.Router()

//lists the cart items with the token related user
cart_router.get('/', cart_controller.view)
cart_router.post('/', cart_controller.create)
cart_router.delete('/', cart_controller.delete)
cart_router.put('/', cart_controller.update)


module.exports = cart_router