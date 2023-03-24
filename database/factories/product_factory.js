const {faker} = require('./faker')
const {current_timestamp} = require("../../helpers/query_helper")
const {run_query} = require("../seeds/seeder");


async function create_random_factory_query(count = 1) {
    let result = {
        queries: "",
        fields: [],
        close_connection: false
    }

    let category_results = []

    await run_query({
        queries: "SELECT id,deleted_at FROM categories",
        fields: [],
        close_connection: false
    })
        .then(r => {
            return r.map(r => {
                category_results.push([r.id, r.deleted_at])
            })
        })

    //console.log(category_results)

    let sql = `insert into products 
            (category_id,title,price,slug,description,quantity,created_at,updated_at,deleted_at)
            values (?,?,?,?,?,?,?,?,?);\n`

    let created_at = current_timestamp
    let updated_at = null
    let chosen_category = []


    for (let i = 0; i < count; i++) {
        created_at = faker.date.past(1)
        updated_at = faker.date.between(created_at, current_timestamp)

        chosen_category = faker.helpers.arrayElement(category_results)
        result.queries += sql + " "

        const product_name = faker.helpers.unique(faker.commerce.productName)

        result.fields.push(
            chosen_category[0],
            product_name,
            faker.commerce.price(),
            faker.helpers.slugify(product_name),
            faker.commerce.productDescription(),
            faker.datatype.number({min: 1, max: 100}),
            created_at,
            updated_at,
            chosen_category[1] !== null ? chosen_category[1]
                : Math.floor(Math.random() * 4) === 3 ? faker.date.between(updated_at, current_timestamp) : null
        )
    }

    //console.log(result)

    return result
}


exports.queries = (count, category_count) => create_random_factory_query(count, category_count)
