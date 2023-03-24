const {faker} = require('./faker')
const {current_timestamp} = require("../../helpers/query_helper");
const {run_query} = require("../seeds/seeder");

//autoincrement must be 1

async function create_random_factory_query(count = 1) {
    let result = {
        queries: "",
        fields: []
    }

    let last_id = null

    await run_query({
        queries: "SELECT id FROM categories ORDER BY id DESC LIMIT 1;",
        fields: [],
        close_connection: false
    })
        .then(r => {
            last_id = r[0] !== undefined ? r[0].id : 0
        })


    //console.log("last id " + last_id)


    let sql = `insert into categories (parent_id,title,slug,created_at,updated_at,deleted_at) values(?,?,?,?,?,?);\n`
    let parent_ids = [null]
    let chosen_parent_id = 0
    let parent_deleted_at = null

    let created_at = current_timestamp
    let updated_at = null

    for (let i = 0; i < count; i++) {
        created_at = faker.date.past(1)
        updated_at = faker.date.between(created_at, current_timestamp)
        chosen_parent_id = faker.helpers.arrayElement(parent_ids)

        parent_deleted_at = result.fields[((chosen_parent_id - last_id) - 1) * 6 + 5]
        //console.log("parent deleted at ", parent_deleted_at)

        result.queries += sql + " "
        const product_name = faker.helpers.unique(faker.commerce.productName)

        result.fields.push(
            chosen_parent_id,
            product_name,
            faker.helpers.slugify(product_name),
            created_at,
            updated_at,
            parent_deleted_at !== undefined ? parent_deleted_at
               : Math.floor(Math.random() * 3) > 1 ? faker.date.between(updated_at, current_timestamp) : null
        )
        parent_ids.push(last_id + 1 + i)
    }

    //console.log(result)

    return result
}


exports.queries = async (count) => await create_random_factory_query(count)
