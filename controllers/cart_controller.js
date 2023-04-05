const {
    successful_create,
    successful_read,
    server_error,
    update_or_delete_response, unsuccessful
} = require("../helpers/response_helper")
const cart = require("../models/cart")
const Joi = require("joi")
const {validate_schema_in_async} = require("../helpers/validation_helper")
const image = require("../models/image")
const {client} = require("../redis");


exports.create = async (req, res) => {
    const schema = Joi.object({
        product_id: Joi.number().required()
    })

    validate_schema_in_async(schema, req.body, res)

    //check if the product is available to add to cart
    const existence = await cart.is_available_to_add_cart({
        user_id: req.auth.user_id,
        product_id: req.body.product_id
    }).then((result) => {
        return result[0] ?? result
    })
        .catch((err) => {
            return undefined
        })

    if (existence === undefined) {
        return server_error(res)
    } else if (existence.length === 0) {
        return unsuccessful(res, "Product does not exist or already added to cart")
    }

    cart.create(req)
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


exports.view = async (req, res) => {
    await cart.findBy({
        value: req.auth.user_id
    })
        .then(async (result) => {
            const product_ids = result.map((product) => {
                return product.product_id
            })

            const products_in_cache = JSON.parse(await client.get("Products"))

            const filtered_products = Object.fromEntries(Object.values(products_in_cache).filter((product) => {
                //console.log(product)

                //total_count is int, holds the total count number record
                if (typeof product === "number") {
                    return false
                }

                return product_ids.includes(product.id)
            }))

            return successful_read(filtered_products, res)
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
