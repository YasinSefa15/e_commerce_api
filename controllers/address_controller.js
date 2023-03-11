const address = require('../models/address')
const {
    successful_create,
    server_error,
    successful_read,
    update_or_delete_response
} = require("../helpers/response_helper")
const {validate_or_throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")

exports.create = (req, res) => {
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(35).required(),
        last_name: Joi.string().min(3).max(35).required(),
        title: Joi.string().min(2).max(35).required(),
        city: Joi.string().min(3).max(50).required(),
        state: Joi.string().min(3).max(50).required(),
        description: Joi.string().min(3).max(50).required(),
        phone: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required()
    })

    validate_or_throw_error(schema, req.body, res)

    address.create({
        user_id: req.auth.user_id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        title: req.body.title,
        state: req.body.state,
        city: req.body.city,
        description: req.body.description,
        phone: req.body.phone
    })
        .then(() => {
            successful_create(res, "Address Created")
        })
        .catch((err) => {
            server_error(res, err)
        })
}

exports.read = (req, res) => {
    address.read({
        user_id: req.auth.user_id,
        column_names: ["id", "first_name", "last_name", "title", "description", "city", "state", "phone"]
    })
        .then((result) => {
            successful_read(result, res, "Addresses Listed")
        })
        .catch((err) => {
            server_error(res, err)
        })
}

//will be implemented when needed
exports.view = (req, res) => {
    res.status(200).send("Address Details")
}


exports.delete = (req, res) => {
    validate_or_throw_error(
        Joi.object({
            id: Joi.number().required()
        }),
        req.body,
        res
    )

    address.delete({
        user_id: req.auth.user_id,
        id: req.body.id
    })
        .then((result) => {
            update_or_delete_response(result["affectedRows"], res)
        })
        .catch((err) => {
            server_error(res, err)
        })
}
