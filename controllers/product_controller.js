const {
    unsuccessful,
    successful_read, server_error, successful_create
} = require("../helpers/response_helper");
const {validate_or_throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")
const product = require("../models/product");
const {loggers} = require("winston");

exports.create = (req, res) => {
    const schema = Joi.object({
        category_id: Joi.number().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        title: Joi.string().min(4).max(25).required(),
        description: Joi.string().min(0).max(255).required(),
    })

    validate_or_throw_error(schema, req.body, res)

    const body = req.body
    console.log(body)
    console.log("product create in")

    product.create({
        category_id: body.category_id,
        title: body.title,
        slug: body.title.replace(/\s+/g, '-').toLowerCase(),
        description: body.description,
        price: body.price,
        quantity: body.quantity,
    })
        .then((result) => {
            successful_create(res, "Product is created")
        })
        .catch((error) => {
            server_error(res, error)
        })
}

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
