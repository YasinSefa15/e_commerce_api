const connection = require("../db");
const logger = require("../logs/logger");

const parse_column_names = (column_names) => {
    return column_names === undefined ? "*" : column_names.join(", ").toString()
}

exports.findOneBy = async (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM products where ${input.column} = '${input.value}' LIMIT 1`

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