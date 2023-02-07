const express = require("express");
const Joi = require('joi')
const user_controller = require('../../controllers/user_controllers')
//import helpers from "../../helpers.js";

//DID NOT TOUCH HERE

const user_router = express.Router()

//lists all the users
user_router.get('/', user_controller.users)

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