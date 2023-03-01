const connection = require("../db")
const {parse_column_names, parse_conditions, current_timestamp} = require("../helpers/query_helper")

exports.create = async (input) => {
    let sql = `insert into products (category_id,title,price,slug,description,quantity,created_at) values (?,?,?,?,?,?,?)`

    return new Promise((resolve, reject) => {
        connection.query(sql, [input.category_id, input.title, input.price, input.slug, input.description, input.quantity, current_timestamp], (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}


exports.findBy = async (input) => {
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM products ${parse_conditions(input.conditions)}`

    console.log(typeof input.conditions)

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