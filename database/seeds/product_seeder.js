const product_factory = require(__dirname + '/../factories/product_factory.js')
const {run_query} = require(__dirname + '/../seeds/seeder.js')
const {terminal_color_codes} = require("../../helpers/colors")
const {client} = require("../../redis")

console.log("*******------PRODUCT SEEDER STARTED------*******")

let inputs = product_factory.queries(10, 100)
//todo connection for all later
inputs.close_connection = false


const seed = async () => {
    run_query(inputs).then(async r => {
        console.log(terminal_color_codes.background.green, "Database Successfully Seeded")
        await client.connect()
        let products = {}
        await run_query({
            queries: "SELECT id,title,slug,category_id,description,quantity FROM products",
            fields: [],
            close_connection: true
        }).then(r => {
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
        }).catch(e => {

        })

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
