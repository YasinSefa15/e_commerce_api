const connection = require('../db.js')
const bcrypt = require("bcrypt")

const timestamps = true
const soft_delete = true

const fields = [
    'first_name',
    'last_name',
    'e_mail',
    'password',
    'phone',
]

const hidden = [
    'password'
]

exports.findAll = async () => {
    let sql = 'SELECT * FROM users'

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
    let sql = `SELECT * FROM users where ${input.column} = '${input.value}' LIMIT 1`
console.log(sql)
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err)
            } else {
                console.log(result)
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
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}