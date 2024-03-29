const user = require('../models/user')
const {successful_create, server_error, successful_login, unsuccessful} = require("../helpers/response_helper");
const {validate_or_throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const auth_token = require("../models/auth_token");
const {v4: uuidv4} = require('uuid');

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

    user.create(req.body)
        .then(result => {
            successful_create(res)
        })
        .catch(error => {
            server_error(res)
        })
}

exports.login = (req, res) => {
    const schema = Joi.object({
        e_mail: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).max(31).required()
    })

    validate_or_throw_error(schema, req.body, res)

    user.findOneBy({
        column: "e_mail",
        value: req.body.e_mail,
        column_names: [
            'id',
            'first_name',
            'last_name',
            'e_mail',
            'password'
        ]
    })
        .then(async result => {
            if (result[0] === undefined) {
                return unsuccessful(res, "Email and/or password is wrong")
            }

            const password_matched = await bcrypt.compare(req.body.password, result[0].password)

            if (password_matched) {
                delete result[0].password

                const uuid = uuidv4()

                await auth_token.create({
                    uuid: uuid,
                    user_id: result[0].id
                })
                const token = jwt.sign(
                    {
                        user_id: 1,
                        uuid: uuid
                    },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "30d",
                    })

                successful_login(result, res, token)
            } else {
                unsuccessful(res, "E-mail and/or password field is wrong")
            }
        })
        .catch(error => {
            server_error(res, error)
        })
}
