const order = require('../models/order')
const {successful_create, server_error, successful_login, unsuccessful} = require("../helpers/response_helper");
const {validate_or_throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")
const {v4: uuidv4} = require('uuid');

exports.create = (req, res) => {
    res.status(200).send("Order Create")
}

exports.read = (req, res) => {
    res.status(200).send("Order Read")
}

exports.view = (req, res) => {
    res.status(200).send("Order Status")
}

exports.delete = (req, res) => {
    res.status(200).send("Order Cancel")
}
