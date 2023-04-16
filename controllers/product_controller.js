const {
    successful_read,
    server_error,
    successful_create,
    update_or_delete_response
} = require("../helpers/response_helper")
const {validate_or_throw_error, validate_schema_in_async} = require("../helpers/validation_helper")
const Joi = require("joi")
const product = require("../models/product")
const image = require("../models/image")
const {client} = require("../redis")


exports.read = async (req, res) => {
    //joi
    const schema = Joi.object({
        limit: Joi.number().integer().min(1),
        offset: Joi.number().integer().min(0),
        searched: Joi.string().min(1).max(63),
    })

    const validation = await validate_schema_in_async(schema, req.query, res)

    if (validation.error) {
        await server_error(res, validation.error)
        return
    }

    let input = {}
    let params = ""

    //console.log(req.query.searched)

    if (req.query.searched) {
        params += ` where (products.title LIKE '%${req.query.searched}%'`
        params += ` or products.description LIKE '%${req.query.searched}%')`
    } else {
        input.conditions = {
            '1': {
                'condition': 'and', 'values': []
            },
        }
    }

    input.params = params

    const product_count = await product.findBy({
        column_names: ["COUNT(*) as count"],
        params: params,
        conditions: input.conditions,
    })


    //console.log(parseInt(req.query.limit))
    input.pagination = {
        limit: !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 10,
        offset: !isNaN(parseInt(req.query.offset)) ? (parseInt(req.query.offset) - 1) * parseInt(req.query.limit) : 0
    }

    input.column_names = [
        "products.id as id", "categories.id as category_id", "products.title as title", "products.description as description",
        "products.price as price", "products.quantity as quantity", "products.slug as slug",
        " products.created_at as created_at", "products.updated_at as updated_at"
    ]

    //console.log(input)


    await product.findBy(input)
        .then(async (result) => {
            //console.log(result.length)
            const meta_data = {
                limit: parseInt(req.query.limit),
                total_page: Math.ceil(product_count[0].count / parseInt(req.query.limit)),
                current_page: parseInt(req.query.offset)
            }
            //console.log(meta_data)

            await successful_read(result, res, "Başarılı", meta_data)

        })
        .catch(async (err) => {
            await server_error(res, err)
        })


}

exports.create = (req, res) => {
    const schema = Joi.object({
        category_id: Joi.number().required(),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
        title: Joi.string().min(4).max(25).required(),
        description: Joi.string().min(0).max(255).required(),

    })

    validate_or_throw_error(schema, req.body, res)

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
                        new_product.images.push({
                            file_path: req.files[i].path,
                            order_of: i,
                            type: 0,
                            product_id: result.insertId,
                        })
                        //console.log(new_product)
                    })
                    .catch(e => {
                        console.log("product controller image create")
                        console.log(e)
                        //server_error(res, e)
                    })
            }


            //todo update cache with images
            //update cache
            let products_db = await product.findBy({
                column_names: ['distinct products.id', 'products.title', 'products.slug', 'products.category_id',
                    'products.price', 'products.description', 'products.quantity'],
            })
            console.log(products_db)
            let products = {}

            const total_count = products_db.length

            for (let i = 0; i < total_count; i++) {
                products[products_db[i].id] = products_db[i]
            }

            if (products) {
                products[insertedId] = new_product
                products.total_count = total_count + 1
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

    const validate = validate_schema_in_async(schema, req.body, res)

    if (validate) {
        return validate
    }

    let cached = JSON.parse(await client.get('Products'))

    console.log(req.body)

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
        .then(async (resolved) => {
            const result = resolved.result

            //in catch unlink files
            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    if (i === 0) {
                        cached[req.body.product_id].images = []
                        await image.delete({
                            product_id: req.body.product_id
                        })
                            .then(r => {
                            })
                    }
                    await image.create({
                        type: 0,
                        product_id: req.body.product_id,
                        file_path: req.files[i].path,
                        order_of: i
                    }).then(r => {
                        cached[req.body.product_id].images.push({
                            type: 0,
                            product_id: req.body.product_id,
                            file_path: "http://" + req.headers.host + "/" + req.files[i].path,
                            order_of: i,
                        })
                    })
                        .catch(e => {
                            console.log("product controller image create")
                            console.log(e)
                        })
                }
            }


            //update cache
            cached[req.body.product_id].title = body.title
            cached[req.body.product_id].slug = resolved.slug
            cached[req.body.product_id].price = body.price
            cached[req.body.product_id].description = body.description
            cached[req.body.product_id].category_id = body.category_id
            cached[req.body.product_id].quantity = body.quantity

            await client.set('Products', JSON.stringify(cached))

            update_or_delete_response(result['affectedRows'], res)

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

    const validation = validate_schema_in_async(schema, req.body, res)

    if (validation) {
        return validation
    }


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

//todo not done
//Product details
exports.view = async (req, res) => {
    const product_result = await product.findOneBy({
        column: 'slug',
        value: req.params.slug
    })

    successful_read(product_result, res)
}
