const {faker} = require('./faker')
const {run_query} = require("../seeds/seeder")
const {current_timestamp} = require("../../helpers/query_helper");

// user ids and products ids

async function create_random_factory_query(count = 1) {
    let result = {
        queries: "",
        fields: [],
        close_connection: false
    }
    let user_ids = []

    await run_query({
        queries: "SELECT id FROM users where deleted_at is null",
        fields: [],
        close_connection: false
    })
        .then(r => {
            return r.map(r => {
                user_ids.push(r.id)
            })
        })

    //console.log("users ", user_ids)


    let sql = `insert into addresses (first_name,last_name,title,city,state,description,phone,user_id,created_at,updated_at) 
            values (?,?,?,?,?,?,?,?,?,?);\n`


    //user can not add same product to cart twice
    for (let i = 0; i < count; i++) {
        result.queries += sql + " "

        result.fields.push(
            faker.name.firstName(),
            faker.name.lastName(),
            faker.name.firstName() + " " + faker.name.lastName(),
            faker.address.city(),
            faker.address.state(),
            faker.address.streetAddress(),
            faker.phone.number('50########'),
            faker.helpers.arrayElement(user_ids), //choose random user
            current_timestamp,
            current_timestamp
        )
    }

    //console.log(result)

    return result
}


exports.queries = (count) => create_random_factory_query(count)
