const express = require("express");
const category_controller = require('../../controllers/category_controller')

const category_router = express.Router()

//lists all the categorys
category_router.get('/', category_controller.read)
category_router.post('/', category_controller.create)
category_router.put('/', category_controller.update)
category_router.delete('/', category_controller.delete)
category_router.get('/:slug', category_controller.view)


module.exports = category_router