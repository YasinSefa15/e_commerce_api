const connection = require("../db");
const logger = require("../logs/logger");
const {current_timestamp} = require("../helpers/query_helper");


exports.create = async (values) => {
    let sql = `insert into auth_tokens (uuid,user_id,created_at,last_used_at) values (?,?,?,?)`

    return new Promise((resolve, reject) => {
        connection.query(sql, [values.uuid, values.user_id, current_timestamp, null], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.update = (uuid) => {
    connection.query('UPDATE auth_tokens SET last_used_at = ? WHERE uuid = ?', [current_timestamp, uuid], function (error, results, fields) {
        logger.error(error)
    })
}