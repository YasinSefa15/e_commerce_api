const express = require("express");
const category_controller = require('../../controllers/category_controller')

const category_router = express.Router()

//lists all the categorys
category_router.get('/', category_controller.read)
category_router.get('/:slug', category_controller.view)


module.exports = category_router