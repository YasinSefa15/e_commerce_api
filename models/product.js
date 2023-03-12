const connection = require("../db")
const {
    parse_column_names, parse_conditions, current_timestamp,
    parse_nested_conditions, parse_multiple_conditions
} = require("../helpers/query_helper")
const logger = require("../logs/logger");

unique_slug = async (title) => {
    let result_slug = ''
    let sql = `select id, slug from products where title = ? order by updated_at desc limit 1`

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
    let sql = `insert into products (category_id,title,price,slug,description,quantity,created_at,updated_at) values (?,?,?,?,?,?,?,?)`

    return new Promise(async (resolve, reject) => {
        const slug = await unique_slug(input.title)
        connection.query(sql, [input.category_id, input.title, input.price, slug, input.description, input.quantity, current_timestamp, current_timestamp], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.delete = async (input) => {
    let sql = `update products set deleted_at = ? ${parse_conditions(input.conditions)} and (deleted_at is null) `
    //let sql = `delete from categories where id = ? `
    console.log(sql)

    return new Promise(async (resolve, reject) => {
        connection.query(sql, [current_timestamp], (err, result) => {
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
    let sql = `update products set category_id = ?, title = ?, price = ?, description = ?, quantity = ?, updated_at = ? where category_id = ?`

    return new Promise(async (resolve, reject) => {
        const slug = await unique_slug(input.title)
        connection.query(sql, [input.category_id, input.title, input.price, slug, input.description, input.quantity, current_timestamp, current_timestamp], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}


//Under categories, all products will be returned; caterogy controller
exports.findBy = async (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM products inner join categories on categories.id = products.category_id  ${parse_conditions(input.conditions)} and categories.deleted_at is null
        and products.deleted_at is null`

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })

    })
}

exports.findOneBy = async (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM products where ${input.column} = '${input.value}' LIMIT 1`

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.is_valid = (input) => {
    let sql = `select sum(price) as total_price,count(*)  as count from products ${parse_nested_conditions(input.conditions)} and deleted_at is null`

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                if (result[0].count === 0) {
                    reject(err)
                }
                //console.log("result[0].total_price", result[0].total_price)
                resolve(result)
            }
        })
    })
}

exports.give_order = (input) => {
    let sql = parse_multiple_conditions(input.conditions)

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