const {
    successful_create,
    server_error,
    successful_login,
    unsuccessful,
    successful_read
} = require("../helpers/response_helper");
const {validate_or_throw_error} = require("../helpers/validation_helper")
const Joi = require("joi")
const category = require("../models/category")

exports.read = async (req, res) => {
    const category_result = await category.all({
        column_names: ['id', 'parent_id', 'title', 'slug']
    })

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
}

exports.view = async (req, res) => {
    const category_result = await category.findOneBy({
        column: 'slug',
        value: req.params.slug
    })

    successful_read(category_result, res)
}
