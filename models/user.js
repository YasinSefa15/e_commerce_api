const connection = require('../db.js')
const bcrypt = require("bcrypt")
const logger = require("../logs/logger");

const parse_column_names = (column_names) => {
    return column_names === undefined ? "*" : column_names.join(", ").toString()
}

exports.findAll = async (input) => {
    console.log(parse_column_names(input.column_names))
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM users`
    console.log(sql)

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
    let sql = `SELECT ${parse_column_names(input.column_names)} FROM users where ${input.column} = '${input.value}' LIMIT 1`

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

exports.create = async (values) => {
    const hashed_password = await bcrypt.hash(values.password, 11)
    let sql = `insert into users (first_name,last_name,e_mail,phone,password) values
        ('${values.first_name}','${values.last_name}','${values.e_mail}','${values.phone}','${hashed_password}')`

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