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
            const insertedId = result.insertId
            //console.log("product controller create", result)
            //in catch unlink files
            let new_product = {
                id: result.insertId,
                title: body.title,
                slug: resolved.slug,
                category_id: body.category_id,
                price: body.price,
                description: body.description,
                quantity: body.quantity,
                images: []
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
                        //console.log(new_product)
                    })
                    .catch(e => {
                        console.log("product controller image create")
                        console.log(e)
                    })

            }

            let products = JSON.parse(await client.get('Products'))
            if (products) {
                products[insertedId] = new_product
                products.total_count += 1
            } else {
                products = {[insertedId]: new_product, "total_count": 1}
            }

            await client.set('Products', JSON.stringify(products))

            //rollback transaction
            successful_create(res, "Product is created")

        })
        .catch((error) => {
            server_error(res, error)
        })
}

//todo ND
//Updating product with images
exports.update = async (req, res) => {
    const schema = Joi.object({
        product_id: Joi.number().positive().required(),
        category_id: Joi.number().positive().required(),
        title: Joi.string().min(4).max(25).required(),
        description: Joi.string().min(0).max(255).required(),
        price: Joi.number().positive().required(),
        quantity: Joi.number().required(),
    })

    validate_or_throw_error(schema, req.body, res)

    let cached = JSON.parse(await client.get('Products'))

    //if cache is empty or product is not in cache
    if (!cached || !cached[req.body.product_id]) {
        update_or_delete_response(0, res)
        return
    }

    const body = req.body

    product.update({
        product_id: body.product_id,
        category_id: body.category_id,
        title: body.title,
        description: body.description,
        price: body.price,
        quantity: body.quantity
    })
        .then((resolved) => {
            const result = resolved.result

            //in catch unlink files
            image.delete({
                product_id: req.body.product_id
            })
                .then(r => {
                })

            for (let i = 0; i < req.files.length; i++) {
                if (i === 0) {
                    cached[req.body.product_id].images = []
                }
                image.create({
                    type: 0,
                    product_id: result.insertId,
                    file_path: req.files[i].path,
                    order_of: i
                }).then(r => {
                    //todo test
                    cached[req.body.product_id].images.push({
                        type: 0,
                        product_id: result.insertId,
                        file_path: "http://" + req.headers.host + "/" + req.files[i].path,
                        order_of: i,
                    })
                })
                    .catch(e => {
                        console.log("product controller image create")
                        console.log(e)
                    })
            }

            cached[req.body.product_id].title = body.title

            cached[req.body.product_id].price = body.price
            cached[req.body.product_id].description = body.description
            cached[req.body.product_id].category_id = body.category_id
            cached[req.body.product_id].quantity = body.quantity

            //rollback transaction
            successful_create(res, "Product is created")

        })
        .catch((error) => {
            server_error(res, error)
        })
}


//Deleting product with images
exports.delete = async (req, res) => {
    const schema = Joi.object({
        product_id: Joi.number().required()
    })

    validate_schema_in_async(schema, req.body, res)

    let cached = JSON.parse(await client.get('Products'))

    //if cache is empty or product is not in cache
    if (!cached || !cached[req.body.product_id]) {
        update_or_delete_response(0, res)
        return
    }


    product.delete({
        conditions: {
            'id': {
                'condition': 'or',
                'values': [req.body.product_id]
            }
        }
    })
        .then(async (result) => {
            image.delete({
                product_id: req.body.product_id
            })
                .then(() => {
                })

            delete cached[req.body.product_id]
            cached.total_count -= 1
            await client.set('Products', JSON.stringify(cached))

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
