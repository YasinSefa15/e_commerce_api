const connection = require("../db");
const logger = require("../logs/logger");
const {current_timestamp, parse_column_names} = require("../helpers/query_helper");


exports.create = (input) => {
    let sql = `insert into addresses (first_name,last_name,title,description,city,state,phone,user_id,created_at,updated_at) values (?,?,?,?,?,?,?,?,?,?)`

    return new Promise((resolve, reject) => {
        connection.query(sql, [input.first_name, input.last_name, input.title,
            input.description, input.city, input.state, input.phone, input.user_id, current_timestamp, current_timestamp], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}


exports.read = (input) => {
    let sql = `select ${parse_column_names(input.column_names)} from addresses where user_id = ? and deleted_at is null`

    return new Promise((resolve, reject) => {
        connection.query(sql, [input.user_id], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.delete = (input) => {
    let sql = `update addresses set deleted_at = ? where id = ? and user_id = ? and deleted_at is null`

    return new Promise((resolve, reject) => {
        connection.query(sql, [current_timestamp, input.id, input.user_id], (err, result) => {
            if (err) {
                logger.error(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}