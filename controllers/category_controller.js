const {
    successful_create,
    server_error,
    successful_login,
    unsuccessful,
    successful_read
} = require("../helpers/response_helper");
const {validate_or_throw_error, throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")
const category = require("../models/category")
const product = require("../models/product")
const {MyError} = require("../helpers/error_by");

let error_occurred = false;

exports.create = async (req, res) => {
    const schema = Joi.object({
        e_mail: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(6).max(31).required()
    })

    validate_or_throw_error(schema, req.body, res)

}

exports.read = (req, res) => {
    category.all({
        column_names: ['id', 'parent_id', 'title', 'slug']
    })
        .then((category_result) => {
            //created an object key is id
            let categories_list = {}

            Object.keys(category_result).forEach(key => {
                const parsed = JSON.parse(JSON.stringify(category_result[key]))
                parsed['children'] = {}
                if (parsed.parent_id === null) {
                    categories_list[parsed.id] = parsed
                } else {
                    const parent = categories_list[parsed.parent_id]
                    const child = parsed
                    categories_list[parsed.id] = child
                    do {
                        parent.children[child.id] = child
                    } while (parent === undefined)
                }
            })

            successful_read(categories_list, res, "Categories listed")
        })
        .catch((err) => {
            server_error(res, err)
        })
}

exports.view = async (req, res) => {
    await category.findBy({
        column: 'slug',
        value: req.params.slug,
        column_names: ['id']
    })
        .then(async (category_result) => {
            await product.findBy({
                column: 'category_id',
                value: category_result[0]['id'],
                conditions: {
                    'category_id': {
                        'condition': 'or',
                        'values': [5, 7, 8]
                    }
                }
            })
                .then((result) => {
                    successful_read(result, res, 'All the products listed with given category')
                })
                .catch((err) => {
                    console.log(err)
                    server_error(res)
                })
        })
        .catch((err) => {
            server_error(res)
        })
}
