const express = require("express")
const address_controller = require('../../controllers/address_controller')
const address_router = express.Router()


//creating an address belong to user
address_router.get('/', address_controller.read)
//creating an address
address_router.post('/', address_controller.create)
//viewing an address details
address_router.get('/:id', address_controller.view)
//deleting an address
address_router.delete('/', address_controller.delete)


module.exports = address_router