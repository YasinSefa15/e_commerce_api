const connection = require("../db");
const logger = require("../logs/logger");
const {MyError} = require("../helpers/error_by");

const parse_column_names = (column_names) => {
    return column_names === undefined ? "*" : column_names.join(", ").toString()
}

const parse_conditions = (conditions) => {
    let query_condition = 'where'
    if (conditions !== undefined) {

        //traverse in conditions object by key
        for (const key in conditions) {
            //accessing values
            if (conditions.hasOwnProperty(key)) {
                //console.log(conditions[key]['condition'])
                //console.log(conditions[key]['values'])

                //creating query string
                conditions[key]['values'].forEach((value) => {
                    query_condition += " " + key + " = " + value + " "
                    if (conditions[key]['values'].length - 1 !== conditions[key]['values'].indexOf(value)) {
                        query_condition += conditions[key]['condition']
                    }
                })
                //console.log(`${key}: ${conditions[key]}`);
            }
        }
    }

    //console.log(query_condition)

    return query_condition
}

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