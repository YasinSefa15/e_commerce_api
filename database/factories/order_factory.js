const {faker} = require('./faker')
const {run_query} = require("../seeds/seeder")
const {current_timestamp} = require("../../helpers/query_helper");

//AUTO INCREMENT MUST BE RESET
//todo timestamps will be added

async function create_random_factory_query(count = 1, category_count = 1) {
    let result = {
        orders: {
            queries: "",
            fields: [],
            close_connection: false
        },
        ordered_items: {
            queries: "",
            fields: [],
            close_connection: false
        }
    }


    let product_records = []
    await run_query({
        queries: "SELECT id,price FROM products where deleted_at is null",
        fields: [],
        close_connection: false
    })
        .then(r => {
            return r.map(r => {
                product_records.push(r)
            })
        })

    //console.log("products ", product_ids)

    let address_records = []
    await run_query({
        queries: "SELECT addresses.id as id ,addresses.user_id as user_id FROM addresses inner join users on users.id = addresses.user_id" +
            " where addresses.deleted_at is null and users.deleted_at is null",
        fields: [],
        close_connection: false
    })
        .then(r => {
            return r.map(r => {
                address_records.push(r)
            })
        })

    //address_ids have user id and address id therefore no need external query to get user ids
    //console.log("address info ", address_records)


    let sql = `insert into orders (user_id,address_id,ordered_items_count,total_price,tracking_code,created_at,updated_at) 
            values (?,?,?,?,?,?,?);\n`

    let sql_order_items = `insert into ordered_products (order_id,product_id,quantity,created_at,updated_at) values (?,?,?,?,?);\n`

    let chosen_products = []
    let chosen_address = []

    //user can not add same product to cart twice
    for (let i = 0; i < count; i++) {
        chosen_products = faker.helpers.arrayElements(product_records, faker.datatype.number({min: 1, max: 10}))
        chosen_address = faker.helpers.arrayElement(address_records)
        result.orders.queries += sql + " "

        //console.log(chosen[[chosen_user_id, chosen_product_id]])
        //chosen[[chosen_user_id, chosen_product_id]] = [chosen_user_id, chosen_product_id]
        result.orders.fields.push(
            chosen_address.user_id,
            chosen_address.id,
            chosen_products.length,
            chosen_products.reduce((a, b) => a + b.price, 0),
            faker.datatype.number({min: 100000000000, max: 999999999999}),
            current_timestamp,
            current_timestamp
        )

        for (let j = 0; j < chosen_products.length; j++) {
            result.ordered_items.queries += sql_order_items + " "
            result.ordered_items.fields.push(
                i + 1,
                chosen_products[j].id,
                faker.datatype.number({min: 1, max: chosen_products[j].quantity}),
                current_timestamp,
                current_timestamp
            )
        }
    }

    //console.log(result)

    return result
}


exports.queries = (count) => create_random_factory_query(count)
