const connection = require("../db");
const logger = require("../logs/logger");
const {parse_column_names, parse_multiple_conditions} = require("../helpers/query_helper");


exports.create = async (values) => {
    let sql = `insert into carts (user_id,product_id) values ('${values.auth.user_id}','${values.body.product_id}')`

    return new Promise((resolve, reject) => {
        connection.query(sql, [values.auth.user_id, values.body.product_id], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.is_available_to_add_cart = async (values) => {
    //if product exists and not in cart by user
    const sql = 'select * from products  where products.id = ? and id not in (select product_id as id from carts where carts.product_id = ? and carts.user_id = ?)'

    return new Promise((resolve, reject) => {
        connection.query(sql, [values.product_id, values.product_id, values.user_id], (err, result) => {
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
    let sql = `SELECT carts.quantity, products.id, products.quantity as product_quantity, products.title, products.slug FROM carts inner join products on products.id = carts.product_id where user_id = ? `

    return new Promise((resolve, reject) => {
        connection.query(sql, [input.value], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.update = (req) => {
    return new Promise((resolve, reject) => {
        connection.query('UPDATE carts SET quantity = ? WHERE user_id = ? and product_id = ?', [req.body.quantity, req.auth.user_id, req.body.product_id], function (error, results, fields) {
            if (error) {
                logger.error(error)
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

exports.delete = (req) => {
    return new Promise((resolve, reject) => {
        connection.query('DELETE FROM carts WHERE user_id = ? and product_id = ?', [req.auth.user_id, req.body.product_id], function (error, results, fields) {
            if (error) {
                logger.error(error)
                reject(error)
            } else {
                resolve(results.affectedRows)
            }
        })
    })
}

exports.delete_all = (input) => {
    const conditions = input.conditions.info
    let sql = ``
    conditions.product_ids.forEach((product_id, index) => {
        sql += `delete from carts where user_id = '${conditions.user_id}' and product_id = '${product_id}'`
        if (index < conditions.product_ids.length - 1) {
            sql += `; `
        }
    })

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