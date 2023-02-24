const connection = require("../db");
const logger = require("../logs/logger");
const {parse_column_names} = require("../helpers/query_helper");


exports.create = async (values) => {
    let sql = `insert into carts (user_id,product_id) values ('${values.auth.user_id}','${values.body.product_id}')`

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

exports.findBy = async (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM carts where ${input.column} = '${input.value}'`

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