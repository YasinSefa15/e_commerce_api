const connection = require("../db");
const logger = require("../logs/logger");
const {MyError} = require("../helpers/error_by");

const parse_column_names = (column_names) => {
    return column_names === undefined ? "*" : column_names.join(", ").toString()
}

const parse_conditions = (conditions) => {
    let query_condition = 'where '
    if (conditions !== undefined) {
        console.log(conditions)
        let a = {}
        let column_name = ''
        for (const key in conditions) {
            if (conditions.hasOwnProperty(key)) {
                conditions[key].forEach((column_value) => {
                    query_condition += key
                    query_condition += ` =  '${column_value}'`
                    if (conditions[key].indexOf(column_value) !== conditions[key].length - 1) {
                        query_condition += ' ' + conditions.condition + ' '
                    }
                })
                console.log(`${key}: ${conditions[key]}`);
            }
        }
    }

    return query_condition
}

exports.findBy = async (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM products where ${parse_conditions(input.conditions)}`

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