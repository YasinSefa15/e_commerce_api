const connection = require('../db.js')

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

};