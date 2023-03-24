const {faker} = require('./faker')
const {current_timestamp} = require("../../helpers/query_helper")

function create_random_user_query(count = 1) {
    let result = {
        queries: "",
        fields: []
    }

    let sql = `INSERT INTO users 
            (first_name,last_name,e_mail,e_mail_verified_at,password,phone,phone_verified_at,created_at,updated_at,deleted_at) 
        VALUES (?,?,?,?,?,?,?,?,?,?);`


    let created_at = current_timestamp
    let updated_at = null

    for (let i = 0; i < count; i++) {
        created_at = faker.date.past(1)
        updated_at = faker.date.between(created_at, current_timestamp)

        result.queries += sql + " "
        result.fields.push(
            faker.name.firstName(),
            faker.name.lastName(),
            faker.internet.email(),
            Math.floor(Math.random() * 2) === 1 ? current_timestamp : null,
            "$2b$11$0/ZjtE7M1586d3iAigBaXuKQ4M2XIJlWi8A3JeR08blkkyJv2OLsa", //123456
            faker.phone.number('50########'),
            Math.floor(Math.random() * 2) === 1 ? current_timestamp : null,
            created_at,
            updated_at,
            Math.floor(Math.random() * 2) === 1 ? faker.date.between(updated_at, current_timestamp) : null
        )
    }

    return result
}


exports.queries = (count) => create_random_user_query(count)
