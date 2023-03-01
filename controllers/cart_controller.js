const {
    successful_create, successful_read, server_error, update_or_delete_response
} = require("../helpers/response_helper");
const cart = require("../models/cart");
const Joi = require("joi");
const {validate_schema_in_async} = require("../helpers/validation_helper");

exports.create = async (req, res) => {
    const schema = Joi.object({
        product_id: Joi.number().required()
    })

    //validate_or_throw_error(schema, req.body, res)
    const validated = validate_schema_in_async(schema, req.body, res)

    if (validated) {
        return validated
    }

    await cart.create(req)
        .then((result) => {
            successful_create(res, "Product added to cart")
        })
        .catch((err) => {
            server_error(res, err)
        })
}

exports.update = async (req, res) => {
    const schema = Joi.object({
        quantity: Joi.number().required(),
        product_id: Joi.number().required()
    })

    //validate_or_throw_error(schema, req.body, res)
    const validated = validate_schema_in_async(schema, req.body, res)

    if (validated) {
        return validated
    }

    await cart.update(req)
        .then((result) => {
            update_or_delete_response(result['affectedRows'], res)
        })
        .catch((err) => {
            server_error(res, err)
        })
}

exports.view = (req, res) => {
    cart.findBy({
        value: req.auth.user_id
    })
        .then((result) => {
            successful_read(result, res)
        })
        .catch((err) => {
            server_error(res, err)
        })
}

exports.delete = async (req, res) => {
    const schema = Joi.object({
        product_id: Joi.number().required()
    })

    //validate_or_throw_error(schema, req.body, res)
    const validated = validate_schema_in_async(schema, req.body, res)

    if (validated) {
        return validated
    }

    await cart.delete(req)
        .then((result) => {
            update_or_delete_response(result['affectedRows'], res)
        })
        .catch((err) => {
            server_error(res, err)
        })
}