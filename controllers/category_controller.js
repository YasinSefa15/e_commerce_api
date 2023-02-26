const {
    server_error,
    unsuccessful,
    successful_read, successful_create
} = require("../helpers/response_helper");
const {validate_or_throw_error, validate_schema_in_async} = require("../helpers/validation_helper")
const Joi = require("joi")
const category = require("../models/category")
const product = require("../models/product")
const {categories_list} = require("../models/category");
const {client} = require("../redis");


exports.create = async (req, res) => {
    const schema = Joi.object({
        parent_id: Joi.number().integer().min(1).required(),
        title: Joi.string().min(3).max(30).required(),
    })

    const validate = validate_schema_in_async(schema, req.body, res)

    if (validate){
        return validat
    }


    //create here
    category.create({
        parent_id: req.body.parent_id,
        title: req.body.title,
        slug: req.body.title
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
            //const value = await client.get('key')

            successful_read(categories_list(category_result), res, "Categories listed")
        })
        .catch((err) => {
            server_error(res, err)
        })
}


exports.view = (req, res) => {
    category.findBy({
        //column: 'slug',
        value: req.params.slug,
        column_names: ['id', 'parent_id', 'slug']
    })
        .then((category_result) => {
            //console.log("category result ")
            //console.log(category_result)

            product.findBy({
                column: 'category_id',
                conditions: {
                    'category_id': {
                        'condition': 'or',
                        'values': category_result
                    },
                }
            })
                .then((result) => {
                    successful_read(result, res, 'All the products listed with given category')
                })
                .catch((err) => {
                    server_error(res, err)
                })

        })
        .catch((err) => {
            server_error(res, err)
        })
}
