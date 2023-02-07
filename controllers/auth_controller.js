const user = require('../models/user')
const {successful_create, server_error} = require("../helpers/response_helper");
const {validate_or_throw_error} = require("../helpers/validation_helper")
const logger = require("../logs/logger");
const Joi = require("joi")

exports.register = (req, res) => {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30),
    })

    validate_or_throw_error(schema, req.body, res)

    user.create({name: req.body.username}).then(result => {
        successful_create(res)
    }).catch(error => {
        logger.error(error)
        server_error(res)
    })
}
