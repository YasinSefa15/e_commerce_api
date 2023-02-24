const connection = require("../db")
const {parse_column_names, parse_conditions} = require("../helpers/query_helper")




exports.findBy = async (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM products ${parse_conditions(input.conditions)}`

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
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
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}