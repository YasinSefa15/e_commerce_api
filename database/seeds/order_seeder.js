console.log("*******------ORDER SEEDER STARTED------*******")

const order_factory = require(__dirname + '/../factories/order_factory.js')
const {run_query} = require(__dirname + '/../seeds/seeder.js')
const {terminal_color_codes} = require("../../helpers/colors");


const seed = async () => {
    const inputs = await order_factory.queries(300)

    //console.log(inputs)

    await run_query(inputs.orders)
        .then(async r => {
                console.log(terminal_color_codes.background.green, "Database Successfully Seeded For Orders")
                inputs.ordered_items.close_connection = true

                await run_query(inputs.ordered_items)
                    .then(async r => {
                        console.log(terminal_color_codes.background.green, "Database Successfully Seeded For Ordered Items")
                    })
                    .catch(e => {
                        console.log(terminal_color_codes.background.red, "Database Seeding Failed For Ordered Items")
                        console.log(terminal_color_codes.background.red, e)
                    })

            }
        ).catch(e => {
            console.log(terminal_color_codes.background.red, "Database Seeding Failed For Orders")
            console.log(terminal_color_codes.background.red, e)
        })
        .then(async () => {
            console.log(terminal_color_codes.background.gray, "*******------ORDER SEEDER ENDED------*******")
        })


}

seed().then(r => {
    console.log("*******------ORDER SEEDER ENDEDXXXX------*******")
})