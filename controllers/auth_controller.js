const user = require('../models/user')
const {successful_create, server_error, successful_login, unsuccessful} = require("../helpers/response_helper");
const {validate_or_throw_error} = require("../helpers/validation_helper")
const logger = require("../logs/logger");
const Joi = require("joi")
const bcrypt = require("bcrypt")

exports.register = (req, res) => {
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(35).required(),
        last_name: Joi.string().min(6).max(50).required(),
        e_mail: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
        phone: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).max(31).required(),
        password_confirmation: Joi.ref('password')
    })
        .with('password', 'password_confirmation')

    validate_or_throw_error(schema, req.body, res)

    user.create(req.body).then(result => {
        successful_create(res)
    }).catch(error => {
        logger.error(error)
        server_error(res)
    })
}

exports.login = (req, res) => {
    const schema = Joi.object({
        e_mail: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).max(31).required()
    })

    validate_or_throw_error(schema, req.body, res)

    user.findOneBy({column: "e_mail", value: req.body.e_mail}).then(async result => {
        const password_matched = await bcrypt.compare(req.body.password, result[0].password)
        if (password_matched) {
            successful_login(result, res, "token_xx")
        } else {
            unsuccessful(res, "E-mail and/or password field is wrong")
        }


    }).catch(error => {
        logger.error(error)
        server_error(res)
    })
}
