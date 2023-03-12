const order = require('../models/order')
const {successful_create, server_error, successful_login, unsuccessful} = require("../helpers/response_helper");
const {validate_or_throw_error, validate_schema_in_async} = require("../helpers/validation_helper")
const Joi = require("joi")
const {v4: uuidv4} = require('uuid');
const address = require("../models/address");
const product = require("../models/product");
const ordered_products = require("../models/ordered_products");
const {current_timestamp} = require("../helpers/query_helper");
const cart = require("../models/cart");


//ordered_items will be sent as an array of object with quantity and product_id
//total price will be calculated on the server side
exports.create = async (req, res) => {
    const schema = Joi.object({
        address_id: Joi.number().positive().required(),
        products: Joi.array().items(Joi.object({
            product_id: Joi.number().positive().required(),
            quantity: Joi.number().positive().required()
        })).required()
    })

    validate_schema_in_async(schema, req.body, res)


    let message = ""

    const address_details = await address.is_valid({
        id: req.body.address_id,
        user_id: req.auth.user_id
    }).catch((err) => {
        message = "Invalid Address"
    }).then((result) => {
        return result
    })

    if (message !== "") {
        unsuccessful(res, message)
        return
    }

    const product_details = await product.is_valid({
        conditions: {
            'id,quantity': {
                '0.values': req.body.products.map((product) => {
                    return product.product_id
                }),
                '1.values': req.body.products.map((product) => {
                    return product.quantity
                }),
                '1.operator': ' >= ',
                '0.operator': ' = ',
                'inner_condition': 'and',
                'outer_condition': 'or'
            },
        }
    }).catch((err) => {
        message = "Invalid Products"
    }).then((result) => {
        //console.log(result)
        return result
    })


    if (message !== "") {
        unsuccessful(res, message)
        return
    }

    if (product_details[0].count !== req.body.products.length) {
        unsuccessful(res, "Some Products are not available")
        return
    }


    //updates quantities of the products
    product.give_order({
        conditions: {
            'quantity,id': {
                "0.values": req.body.products.map((product) => {
                    return product.quantity
                }),
                "1.values": req.body.products.map((product) => {
                    return product.product_id
                }),
                "table": "products",
                "operation": "update"
            },
        }
    })
        .then((result) => {
            //console.log("update order pro " ,result)
        })
        .catch((err) => {
            console.log(err)
        })

    cart.delete_all({
        conditions: {
            'info': {
                "user_id": req.auth.user_id,
                "product_ids": req.body.products.map((product) => {
                    return product.product_id
                }),
            },
        }
    })
        .then((result) => {

        })

    order.create({
        user_id: req.auth.user_id,
        address_id: req.body.address_id,
        ordered_items_count: req.body.products.length,
        total_price: product_details[0].total_price,
    })
        .then((result) => {
            let values = []
            for (let i = 0; i < req.body.products.length; i++) {
                values.push([result.insertId, req.body.products[i].product_id, req.body.products[i].quantity,
                    "current_timestamp", "current_timestamp"])
            }

            ordered_products.create({
                conditions: {
                    "x": {
                        fields: ['order_id', 'product_id', 'quantity', 'created_at', 'updated_at'],
                        values: values,
                        table: 'ordered_products',
                        operation: "insert"
                    }
                }
            })
                .then(() => {
                    successful_create(res, "Order is Created")
                })

        })
        .catch((err) => {
            server_error(res, err)
        })
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
