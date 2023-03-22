const {faker} = require('./faker')
const {run_query} = require("../seeds/seeder")

// user ids and products ids

async function create_random_factory_query(count = 1, category_count = 1) {
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

    let product_ids = []
    await run_query({
        queries: "SELECT id FROM products where deleted_at is null",
        fields: [],
        close_connection: false
    })
        .then(r => {
            return r.map(r => {
                product_ids.push(r.id)
            })
        })

    //console.log("products ", product_ids)

    let sql = `insert into carts (user_id,product_id,quantity) values (?,?,?);\n`

    let chosen = []
    let chosen_user_id = 0
    let chosen_product_id = 0

    //user can not add same product to cart twice
    for (let i = 0; i < count; i++) {
        chosen_user_id = faker.helpers.arrayElement(user_ids)
        chosen_product_id = faker.helpers.arrayElement(product_ids)

        if (chosen[[chosen_user_id, chosen_product_id]]) {
            continue
        }
        result.queries += sql + " "

        chosen[[chosen_user_id, chosen_product_id]] = [chosen_user_id, chosen_product_id]
        //console.log(chosen[[chosen_user_id, chosen_product_id]])
        //chosen[[chosen_user_id, chosen_product_id]] = [chosen_user_id, chosen_product_id]
        result.fields.push(
            faker.helpers.arrayElement(user_ids),
            faker.helpers.arrayElement(product_ids),
            faker.datatype.number({min: 1, max: 12})
        )
    }

    //console.log(result)

    return result
}


exports.queries = (count, category_count) => create_random_factory_query(count, category_count)
