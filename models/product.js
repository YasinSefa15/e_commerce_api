const connection = require("../db")
const {
    parse_column_names, parse_conditions, current_timestamp,
    parse_nested_conditions, parse_multiple_conditions, pagination_parser, unique_slug
} = require("../helpers/query_helper")
const logger = require("../logs/logger");


exports.create = async (input) => {
    let sql = `insert into products (category_id,title,price,slug,description,quantity,created_at,updated_at) values (?,?,?,?,?,?,?,?)`

    return new Promise((resolve, reject) => {
        const slug = unique_slug(input.title)
        connection.query(sql, [input.category_id, input.title, input.price, slug, input.description, input.quantity, current_timestamp, current_timestamp], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve({result: result, slug: slug})
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
    let sql = `update products set category_id = ?, title = ?, price = ?, slug = ?,description = ?, quantity = ?,updated_at = ? where id = ? and deleted_at is null`

    return new Promise(async (resolve, reject) => {
        const slug = await unique_slug(input.title)
        connection.query(sql, [input.category_id, input.title, input.price, slug, input.description, input.quantity, current_timestamp, input.product_id], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve({result: result, slug: slug})
            }
        })
    })
}


//Under categories, all products will be returned; caterogy controller
exports.findBy = (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM products inner join categories 
        on categories.id = products.category_id  ${parse_conditions(input.conditions)} ${input.params ?? ""} and categories.deleted_at is null
        and products.deleted_at is null order by products.id
        ${pagination_parser(input.pagination)} `

    console.log(sql)

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