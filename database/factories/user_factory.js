const {faker} = require('./faker')
const {current_timestamp} = require("../../helpers/query_helper")

function create_random_user_query(count = 1) {
    let result = {
        queries: "",
        fields: []
    }

    let sql = `INSERT INTO users (first_name,last_name,e_mail,password,phone,created_at,updated_at) VALUES (?,?,?,?,?,?,?);`

    for (let i = 0; i < count; i++) {
        result.queries += sql + " "
        result.fields.push(
            faker.name.firstName(),
            faker.name.lastName(),
            faker.internet.email(),
            "$2b$11$0/ZjtE7M1586d3iAigBaXuKQ4M2XIJlWi8A3JeR08blkkyJv2OLsa", //123456
            faker.phone.number('50########'),
            current_timestamp,
            current_timestamp
        )
    }

    return result
}


exports.queries = (count) => create_random_user_query(count)
