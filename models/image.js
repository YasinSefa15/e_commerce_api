const connection = require("../db");
const logger = require("../logs/logger");
const {parse_column_names, current_timestamp, parse_conditions, bind} = require("../helpers/query_helper");
require('dotenv').config({path: __dirname + '/../.env'})
const full_url = "http://" + process.env.HOST + ":" + process.env.PORT + "/"

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
    let sql = `SELECT type,product_id, CONCAT(?,'',file_path) as file_path,order_of FROM images ${parse_conditions(input.conditions)} and deleted_at is null`
    console.log(sql)

    return new Promise((resolve, reject) => {
        connection.query(sql, [full_url, input.value], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                const binded = bind({
                    source: input.result,
                    with: result,
                    with_key: 'images',
                    foreign_key: 'product_id',
                    key: 'id'
                })

                resolve(binded)
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

exports.delete = (input) => {
    return new Promise((resolve, reject) => {
        connection.query('update images set deleted_at = ? where product_id = ? and deleted_at is null',
            [current_timestamp, input.product_id], function (error, results, fields) {
                if (error) {
                    logger.error(error)
                    reject(error)
                } else {
                    resolve(results.affectedRows)
                }
            })
    })
}