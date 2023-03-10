const connection = require("../db");
const logger = require("../logs/logger");
const {parse_column_names, current_timestamp, parse_conditions, bind} = require("../helpers/query_helper");


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
    let sql = `SELECT * FROM images ${parse_conditions(input.conditions)} and deleted_at is null`

    return new Promise((resolve, reject) => {
        connection.query(sql, [input.value], (err, result) => {
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