const {
    unsuccessful,
    successful_read
} = require("../helpers/response_helper");
const {validate_or_throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")
const product = require("../models/product");

exports.read = (req, res) => {
    console.log("product read in")
    successful_read([], res)
}

exports.view = async (req, res) => {
    const product_result = await product.findOneBy({
        column: 'slug',
        value: req.params.slug
    })

    successful_read(product_result, res)
}
