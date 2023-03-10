const {
    unsuccessful,
    successful_read, server_error, successful_create
} = require("../helpers/response_helper");
const {validate_or_throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")
const product = require("../models/product")
const image = require("../models/image")

exports.create = (req, res) => {
    const schema = Joi.object({
        category_id: Joi.number().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        title: Joi.string().min(4).max(25).required(),
        description: Joi.string().min(0).max(255).required()
    })

    validate_or_throw_error(schema, req.body, res)

    const body = req.body

    product.create({
        category_id: body.category_id,
        title: body.title,
        description: body.description,
        price: body.price,
        quantity: body.quantity,
    })
        .then((result) => {
            //in catch unlink files
            for (let i = 0; i < req.files.length; i++) {
                image.create({
                    type: 0,
                    product_id: result.insertId,
                    file_path: req.files[i].path,
                    order_of: i
                }).then(r => {
                })
                    .catch(e => {
                        console.log("product controller image create")
                        console.log(e)
                    })
            }
            //rollback transaction
            successful_create(res, "Product is created")

        })
        .catch((error) => {
            server_error(res, error)
        })
}

exports.update = (req, res) => {
    const schema = Joi.object({
        old_category_id: Joi.number().required(),
        category_id: Joi.number().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        title: Joi.string().min(4).max(25).required(),
        description: Joi.string().min(0).max(255).required()
    })

    validate_or_throw_error(schema, req.body, res)

    const body = req.body

    product.create({
        category_id: body.category_id,
        title: body.title,
        description: body.description,
        price: body.price,
        quantity: body.quantity,
    })
        .then((result) => {
            //in catch unlink files
            for (let i = 0; i < req.files.length; i++) {
                image.create({
                    type: 0,
                    product_id: result.insertId,
                    file_path: req.files[i].path,
                    order_of: i
                }).then(r => {
                })
                    .catch(e => {
                        console.log("product controller image create")
                        console.log(e)
                    })
            }
            //rollback transaction
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
