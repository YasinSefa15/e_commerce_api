const {
    server_error,
    successful_read,
    successful_create,
    update_or_delete_response
} = require("../helpers/response_helper")
const {validate_schema_in_async, validate_or_throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")
const category = require("../models/category")
const product = require("../models/product")
const {categories_list} = require("../models/category")
const {client} = require("../redis")
const images = require("../models/image")


exports.create = (req, res) => {
    const schema = Joi.object({
        parent_id: Joi.number().integer().min(1),
        title: Joi.string().min(3).max(30).required(),
    })

    validate_or_throw_error(schema, req.body)

    category.create({
        parent_id: req.body.parent_id, title: req.body.title
    })
        .then(async (inserted) => {
            category.all({
                column_names: ['id', 'parent_id', 'title', 'slug']
            })
                .then(async (category_result) => {
                    //after creating the category, we need to update the redis cache
                    await client.set('Categories', JSON.stringify(categories_list(category_result)))
                    //successful_read(categories_list(category_result), res, "Categories listed")
                    successful_create(res, "Category created")
                })
                .catch((err) => {
                    server_error(res, err)
                })

        })
        .catch((err) => {
            server_error(res, err)
        })
}

exports.read = async (req, res) => {
    category.all({
        column_names: ['id', 'parent_id', 'title', 'slug']
    })
        .then(async (category_result) => {
            successful_read(categories_list(category_result), res, "Categories listed")
        })
        .catch((err) => {
            server_error(res, err)
        })
}

exports.list = async (req, res) => {
    //if the cache is not available, we need to fetch the data from the database
    category.all({
        column_names: ['id', 'title']
    })
        .then(async (category_result) => {
            successful_read(category_result, res, "Categories listed")
        })
        .catch((err) => {
            server_error(res, err)
        })
}

exports.view = (req, res) => {
    const schema = Joi.object({
        limit: Joi.number().integer().min(1), //records per page
        page: Joi.string().min(1) //page number
    })
        .with('limit', 'page')
        .with('page', 'limit')

    validate_or_throw_error(schema, req.query, res)


    category.findBy({
        //column: 'slug',
        value: req.params.slug, column_names: ['id', 'parent_id', 'slug']
    })
        .then(async (categories_ids) => {

            if (categories_ids.length === 0) {
                successful_read([], res, "No category found")
                return
            }

            product.findBy({
                column_names: ['products.id', 'products.title', 'products.slug', 'products.price', 'products.description', 'products.category_id', 'products.quantity'],
                column: 'category_id',
                conditions: {
                    'products.category_id': {
                        'condition': 'or', 'values': categories_ids
                    }
                },
                pagination: {
                    limit: parseInt(req.query.limit),
                    offset: (parseInt(req.query.page) - 1) * parseInt(req.query.limit)
                }
            })
                .then((result) => {
                    images.findBy({
                        conditions: {
                            'product_id': {
                                'condition': 'or',
                                'values': result.map((product) => {
                                    return product.id
                                })
                            },
                        }, result: result, bind: result
                    })
                        .then(async (images) => {
                            //console.log(images)
                            //console.log(result)
                            //can not cache the product since there is condition on the query, all product did not fetch

                            successful_read(images, res, 'All the products listed with given category')
                        })
                        .catch((err) => {
                            server_error(res, err)
                        })
                })
                .catch((err) => {
                    server_error(res, err)
                })

        })
        .catch((err) => {
            server_error(res, err)
        })
}

exports.update = (req, res) => {
    const schema = Joi.object({
        id: Joi.number().integer().min(1).required(),
        parent_id: Joi.number().integer().min(1).less(Joi.ref('id')),
        title: Joi.string().min(3).max(30).required()
    })

    const validate = validate_schema_in_async(schema, req.body, res)

    if (validate) {
        return validate
    }

    //if the cache is not available, we need to fetch the data from the database
    category.update(req.body)
        .then(async (result) => {

            category.all({
                column_names: ['id', 'parent_id', 'title', 'slug']
            })
                .then(async (categories_db) => {
                    await client.set('Categories', JSON.stringify(categories_list(categories_db)))
                    //console.log("categories_db")
                    //console.log(categories_db)
                    update_or_delete_response(result['affectedRows'], res)
                })
                .catch((err) => {
                    server_error(res, err)
                })

        })
        .catch((err) => {
            server_error(res, err)
        })
}


//todo delete images, code can not be nested maybe
exports.delete = (req, res) => {
    const schema = Joi.object({
        id: Joi.number().integer().min(1).required()
    })

    const validate = validate_schema_in_async(schema, req.body, res)

    if (validate) {
        return validate
    }

    category.all({
        column_names: ['id', 'parent_id', 'title', 'slug']
    })
        .then(async (categories_db) => {
            //if the cache is not available, we need to fetch the data from the database
            await category.delete({
                id: req.body.id, all_categories: categories_db
            })
                .then(async (resolved) => {
                    if (resolved.result['affectedRows'] !== 0) {
                        await client.set('Categories', JSON.stringify(categories_list(resolved.final_category_list)))

                    }

                    update_or_delete_response(resolved.result['affectedRows'], res)

                })
                .catch((err) => {
                    server_error(res, err)
                })

        })
        .catch((err) => {
        })
}
