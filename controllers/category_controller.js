const {
    successful_create,
    server_error,
    successful_login,
    unsuccessful,
    successful_read
} = require("../helpers/response_helper");
const {validate_or_throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")
const category = require("../models/category")

exports.read = (req, res) => {
    console.log("category read")
    successful_read([], res)
}

exports.view = async (req, res) => {
    const category_result = await category.findOneBy({
        column: 'slug',
        value: req.params.slug
    })

    successful_read(category_result, res)
}
