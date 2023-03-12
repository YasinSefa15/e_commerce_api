const connection = require("../db");
const logger = require("../logs/logger");
const {
    parse_column_names,
    current_timestamp,
    parse_conditions,
    bind,
    parse_multiple_conditions
} = require("../helpers/query_helper");


//all product ids will be sent
//ND
exports.create = async (input) => {
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