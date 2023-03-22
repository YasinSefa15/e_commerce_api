const {faker} = require('./faker')
const {current_timestamp} = require("../../helpers/query_helper")


function create_random_factory_query(count = 1, category_count = 1) {
    let result = {
        queries: "",
        fields: [],
        close_connection: false
    }

    let sql = `insert into products (category_id,title,price,slug,description,quantity,created_at,updated_at) values (?,?,?,?,?,?,?,?);\n`


    for (let i = 0; i < count; i++) {
        result.queries += sql + " "
        const product_name = faker.helpers.unique(faker.commerce.productName)
        result.fields.push(
            faker.datatype.number({min: 1, max: category_count}),
            product_name,
            faker.commerce.price(),
            faker.helpers.slugify(product_name),
            faker.commerce.productDescription(),
            faker.datatype.number({min: 1, max: 100}),
            current_timestamp,
            current_timestamp
        )
    }

    //console.log(result)

    return result
}


exports.queries = (count, category_count) => create_random_factory_query(count, category_count)
