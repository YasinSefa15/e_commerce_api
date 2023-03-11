const express = require("express")
const order_controller = require('../../controllers/order_controller')
const order_router = express.Router()


//creating an orders belong to user
order_router.get('/', order_controller.read)
//creating an order
order_router.post('/', order_controller.create)
//viewing an order details
order_router.get('/sth', order_controller.view)
//canceling an order
order_router.delete('/', order_controller.delete)


module.exports = order_router