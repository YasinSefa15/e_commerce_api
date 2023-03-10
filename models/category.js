const connection = require("../db");
const logger = require("../logs/logger");
const {client, connection_status, redis_status} = require("../redis");
const {parse_column_names, current_timestamp, parse_conditions} = require("../helpers/query_helper");


exports.categories_list = (category_result) => {
    let categories_list = {}

    Object.keys(category_result).forEach(key => {
        const parsed = JSON.parse(JSON.stringify(category_result[key]))
        parsed['children'] = {}
        if (parsed.parent_id === null) {
            categories_list[parsed.id] = parsed
        } else {
            let parent = categories_list[parsed.parent_id]
            if (parent) {
                const child = parsed
                categories_list[parsed.id] = child
                do {
                    parent.children[child.id] = child
                } while (parent === undefined)
            }
        }
    })
    return categories_list
}

const recursive_ids = (category_object, ids_array) => {
    let children = category_object.children
    //console.log("passed children")
    //console.log(children)

    for (const prop in children) {
        ids_array.push(children[prop].id)
        //console.log(children[prop])
        recursive_ids(children[prop], ids_array)
    }

    return ids_array
}

const subcategories_id = (categories_list, slug) => {
    let ids = []
    //console.log("-------")
    for (const objKey in categories_list) {
        const obj = categories_list[objKey];
        //console.log(obj)
        if (obj.slug === slug) {
            ids.push(obj.id)
            ids = recursive_ids(obj, ids)
        }
    }
    return ids
}


unique_slug = async (title) => {
    let result_slug = ''
    let sql = `select id, slug from categories where title = ? order by updated_at desc limit 1`

    await new Promise(async (resolve, reject) => {
        connection.query(sql, [title], (err, result,) => {
            if (err) {
                logger.error(err)
                //console.log(err)
                result_slug = title.toLowerCase().replace(' ', '-') + '-' + 1
            } else {
                if (result[0]) {
                    const last_slug = result[0].slug.substring(result[0].slug.lastIndexOf('-') + 1)

                    if (!isNaN(parseInt(last_slug))) {
                        console.log("last slug is a number")
                        result_slug = title.toLowerCase().replace(' ', '-') + '-' + (parseInt(last_slug) + 1)
                    } else {
                        result_slug = title.toLowerCase().replace(' ', '-') + '-' + 1
                    }

                } else {
                    console.log("last slug is not a number")
                    result_slug = title.toLowerCase().replace(' ', '-')
                }
            }
            resolve()
        }, [title])
    })

    return result_slug
}

exports.create = async (input) => {
    let sql = `insert into categories (parent_id,title,slug,created_at,updated_at) values(?,?,?,?,?) ` //where ${input.column} = '${input.value}'

    return new Promise(async (resolve, reject) => {
        const slug = await unique_slug(input.slug)
        connection.query(sql, [input.parent_id ?? null, input.title, slug, current_timestamp, current_timestamp], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.findBy = async (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM categories where deleted_at is null` //where ${input.column} = '${input.value}'

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                const categories_list = this.categories_list((result))
                const subcategories_ids = subcategories_id(categories_list, input.value)
                resolve(subcategories_ids)
            }
        })
    })

}


exports.all = async (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM categories where deleted_at is null`

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}


exports.findOneBy = async (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM categories where ${input.column} = '${input.value}' LIMIT 1`

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.update = async (input) => {
    let sql = `update categories set title = ?, slug = ?, parent_id = ? ,updated_at = ? where id = ? and deleted_at is null`
    const slug = await unique_slug(input.title)

    return new Promise(async (resolve, reject) => {
        connection.query(sql, [input.title, slug, input.parent_id, current_timestamp, input.id], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

const remove_children = (categories_list, id_array) => {
    let my_list = categories_list
    let result = []

    for (const prop in my_list) {
        if (!id_array.includes(my_list[prop].id)) {
            result.push(my_list[prop])
        }
    }

    return result
}

exports.delete = async (input) => {
    //console.log(input.all_categories)
    //to get sub ids of the category need to create list first
    const categories_list = this.categories_list((input.all_categories))

    if (!categories_list[input.id]) {
        return new Promise((resolve, reject) => {
            resolve({
                result: {
                    affectedRows: 0
                }
            })
        })
    }

    //getting sub ids
    const subcategories_ids = subcategories_id(categories_list, categories_list[input.id].slug)
    //removing sub ids from the original list
    const removed_list = remove_children(input.all_categories, subcategories_ids)
    //creating final list
    const final_category_list = this.categories_list(removed_list)

    const conditions = parse_conditions({
        'id': {
            'condition': 'or',
            'values': subcategories_ids
        }
    })


    let sql = `update categories set deleted_at = ? ${conditions} and (deleted_at is null) `
    //let sql = `delete from categories where id = ? `

    console.log(sql)

    return new Promise(async (resolve, reject) => {
        connection.query(sql, [current_timestamp], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve({
                    result,
                    final_category_list,
                    subcategories_ids
                })
            }
        })
    })
}