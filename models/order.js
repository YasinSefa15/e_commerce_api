const connection = require("../db");
const logger = require("../logs/logger");
const {parse_column_names, current_timestamp, parse_conditions, bind} = require("../helpers/query_helper");


//ND
exports.create = async (values) => {
    let sql = `insert into orders (user_id,address_id,ordered_items_count,total_price,tracking_code,created_at,updated_at) values (?,?,?,?,?,?,?)`

    return new Promise((resolve, reject) => {
        connection.query(sql, [values.user_id, values.address_id, values.ordered_items_count,
            values.total_price, null, current_timestamp, current_timestamp], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}