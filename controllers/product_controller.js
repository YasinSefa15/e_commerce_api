const {
    unsuccessful,
    successful_read, server_error, successful_create, update_or_delete_response
} = require("../helpers/response_helper");
const {validate_or_throw_error, validate_schema_in_async} = require("../helpers/validation_helper")
const Joi = require("joi")
const product = require("../models/product")
const image = require("../models/image")
const {client} = require("../redis");

exports.create = (req, res) => {
    const schema = Joi.object({
        category_id: Joi.number().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        title: Joi.string().min(4).max(25).required(),
        description: Joi.string().min(0).max(255).required()
    })

    validate_schema_in_async(schema, req.body, res)

    const body = req.body

    product.create({
        category_id: body.category_id,
        title: body.title,
        description: body.description,
        price: body.price,
        quantity: body.quantity,
    })
        .then(async (resolved) => {
            const result = resolved.result
            //console.log("product controller create", result)
            //in catch unlink files
            let new_product = {
                id: result.insertId,
                category_id: body.category_id,
                title: body.title,
                description: body.description,
                price: body.price,
                quantity: body.quantity,
                images: [],
                slug: resolved.slug
            }

            for (let i = 0; i < req.files.length; i++) {
                await image.create({
                    type: 0,
                    product_id: result.insertId,
                    file_path: req.files[i].path,
                    order_of: i
                })
                    .then((r) => {
                        //todo file path will be updated
                        new_product.images.push({
                            file_path: "http://127.0.0.1:8080/" + req.files[i].path,
                            order_of: i,
                            type: 0,
                            product_id: result.insertId,
                        })
                        console.log(new_product)
                    })
                    .catch(e => {
                        console.log("product controller image create")
                        console.log(e)
                    })

            }

            let products = JSON.parse(await client.get('Products'))
            if (products) {
                products.push(new_product)
            } else {
                products = [new_product]
            }

            await client.set('Products', JSON.stringify(products))


            //rollback transaction
            successful_create(res, "Product is created")

        })
        .catch((error) => {
            server_error(res, error)
        })
}

//ND
//Updating product with images
exports.update = (req, res) => {
    const schema = Joi.object({
        old_category_id: Joi.number().required(),
        category_id: Joi.number().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        title: Joi.string().min(4).max(25).required(),
        description: Joi.string().min(0).max(255).required()
    })

    validate_or_throw_error(schema, req.body, res)

    const body = req.body

    product.update({
        category_id: body.category_id,
        title: body.title,
        description: body.description,
        price: body.price,
        quantity: body.quantity,
    })
        .then((result) => {
            //in catch unlink files
            for (let i = 0; i < req.files.length; i++) {
                image.create({
                    type: 0,
                    product_id: result.insertId,
                    file_path: req.files[i].path,
                    order_of: i
                }).then(r => {
                })
                    .catch(e => {
                        console.log("product controller image create")
                        console.log(e)
                    })
            }
            //rollback transaction
            successful_create(res, "Product is created")

        })
        .catch((error) => {
            server_error(res, error)
        })
}

//ND
//Deleting product with images
exports.delete = (req, res) => {
    const schema = Joi.object({
        product_id: Joi.number().required()
    })

    validate_or_throw_error(schema, req.body, res)

    product.delete({
        conditions: {
            'id': {
                'condition': 'or',
                'values': [req.body.product_id]
            }
        }
    })
        .then((result) => {
            image.delete({
                product_id: req.body.product_id
            })
                .then((result) => {

                })

            update_or_delete_response(result["affectedRows"], res)
        })
        .catch((error) => {
            server_error(res, error)
        })
}

//ND
//Product details
exports.view = async (req, res) => {
    const product_result = await product.findOneBy({
        column: 'slug',
        value: req.params.slug
    })

    successful_read(product_result, res)
}
