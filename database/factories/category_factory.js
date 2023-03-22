const {faker} = require('./faker')
const {current_timestamp} = require("../../helpers/query_helper");
const connection = require(__dirname + "/../../db")
//todo en son id ye gerek ypk aslında 1 kere çalıştır yeterli

async function create_random_factory_query(count = 1) {
    let result = {
        queries: "",
        fields: []
    }

    let last_category_id = await (new Promise(async (resolve, reject) => {
        await connection.query("SELECT id FROM categories where deleted_at is null ORDER BY id DESC LIMIT 1;",
            async (err, result) => {
                //await connection.end()
                if (err) {
                    //console.log(err)
                    resolve([])
                } else {
                    resolve(result)
                }
            })
    })).then(
        r => {
            return r
        }
    )

    //console.log("......", last_category_id)


    let last_id = last_category_id[0] ? last_category_id[0].id : 0
    //console.log(last_id)


    let sql = `insert into categories (parent_id,title,slug,created_at,updated_at) values(?,?,?,?,?);\n`
    let parent_ids = [null]


    for (let i = 0; i < count; i++) {
        result.queries += sql + " "
        const product_name = faker.helpers.unique(faker.commerce.productName)
        result.fields.push(
            faker.helpers.arrayElement(parent_ids),
            product_name,
            faker.helpers.slugify(product_name),
            current_timestamp,
            current_timestamp
        )
        parent_ids.push(last_id + 1 + i)
    }

    //console.log(result)

    return result
}


exports.queries = async (count) => await create_random_factory_query(count)
