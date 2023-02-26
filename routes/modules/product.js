const express = require("express");
const product_controller = require('../../controllers/product_controller')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})

const product_router = express.Router()

//lists all the products
//maybe filtering on read operation
//product_router.get('/', product_controller.read)
product_router.post('/', upload.array('photos', 12), product_controller.create)
product_router.get('/:slug', product_controller.view)


module.exports = product_router