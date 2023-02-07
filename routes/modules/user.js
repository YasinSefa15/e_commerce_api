const express = require("express");
const Joi = require('joi')
//import helpers from "../../helpers.js";

//DID NOT TOUCH HERE

const user_router = express.Router()

user_router.get('/:id', (req, res) => {
    const schema = Joi.object({
        id: Joi.string().alphanum().min(3).max(30).required(),
    })

    //helpers.continue_or_throw_validation(schema, req.params, res)

    res.status(200).json({
        "message": "User showed"
    })

})

user_router.put('/:id', (req, res) => {
    const schema = Joi.object({
        id: Joi.string().alphanum().min(3).max(30).required(),
    })

    //helpers.continue_or_throw_validation(schema, req.params, res)

    res.status(201).json({
        "message": "User is updated"
    })
})

module.exports = user_router