const express = require("express");
const product_controller = require('../../controllers/product_controller')
const multer = require('multer')
const {v4: uuidv4} = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + '.jpeg')
    }
})

const upload = multer({
    storage: storage
})

const product_router = express.Router()

//lists all the products
//maybe filtering on read operation
//product_router.get('/', product_controller.read)
product_router.post('/', upload.array('files', 3), product_controller.create)
product_router.put('/', upload.array('files', 3), product_controller.update)
product_router.get('/:slug', product_controller.view)
product_router.delete('/', product_controller.delete)


module.exports = product_router