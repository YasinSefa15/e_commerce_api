console.log("*******------PRODUCT SEEDER STARTED------*******")

const product_factory = require(__dirname + '/../factories/product_factory.js')
const {run_query} = require(__dirname + '/../seeds/seeder.js')
const {terminal_color_codes} = require("../../helpers/colors")
const {client} = require("../../redis")


const seed = async () => {
    let inputs = await product_factory.queries(150)
    inputs.close_connection = false

    run_query(inputs).then(async r => {
        console.log(terminal_color_codes.background.green, "Database Successfully Seeded")

        let products = {}

        await run_query({
            queries: "SELECT products.id,products.title,products.slug,products.category_id,products.description,products.quantity " +
                "FROM products " +
                "inner join categories on categories.id = products.category_id" +
                " where products.deleted_at is null and categories.deleted_at is null;",
            fields: [],
            close_connection: true
        })
            .catch(e => {
                console.log(terminal_color_codes.background.red, "Database Seeding Failed")
                console.log(terminal_color_codes.background.red, e)
            })
            .then(r => {
                r.map(p => {
                    products[p.id] = {
                        id: p.id,
                        title: p.title,
                        slug: p.slug,
                        category_id: p.category_id,
                        description: p.description,
                        quantity: p.quantity,
                        images: []
                    }

                    products.total_count = r.length
                })
            })

        await client.connect()

        await client.set("Products", JSON.stringify(products))
        await client.quit()

    }).catch(e => {
        console.log(terminal_color_codes.background.red, "Database Seeding Failed")
        console.log(terminal_color_codes.background.red, e)
    })
}


seed().then(r => {
    console.log("*******------PRODUCT SEEDER ENDED------*******")
})
