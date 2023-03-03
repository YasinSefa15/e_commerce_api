const connection = require("../db");
const logger = require("../logs/logger");
const {parse_column_names, current_timestamp} = require("../helpers/query_helper");


//array can send and insert all together
exports.create = async (values) => {
    let sql = `insert into images (type,product_id,file_path,order_of,created_at) values (?,?,?,?,?)`

    return new Promise((resolve, reject) => {
        connection.query(sql, [values.type, values.product_id, values.file_path, values.order_of, current_timestamp], (err, result) => {
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
    let sql = `SELECT * FROM carts inner join products on products.id = carts.product_id where user_id = ? `

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