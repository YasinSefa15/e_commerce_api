const {
    server_error,
    unsuccessful,
    successful_read
} = require("../helpers/response_helper");
const {validate_or_throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")
const category = require("../models/category")
const product = require("../models/product")
const {categories_list} = require("../models/category");


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
