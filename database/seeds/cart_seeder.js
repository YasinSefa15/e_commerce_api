const cart_factory = require(__dirname + '/../factories/cart_factory.js')
const {run_query} = require(__dirname + '/../seeds/seeder.js')
const {terminal_color_codes} = require("../../helpers/colors")

console.log("*******------CART SEEDER STARTED------*******")



const seed = async () => {
    let inputs = await cart_factory.queries(100)
    inputs.close_connection = true
    run_query(inputs).then(async r => {
        console.log(terminal_color_codes.background.green, "Database Successfully Seeded")
    }).catch(e => {
        console.log(terminal_color_codes.background.red, "Database Seeding Failed")
        console.log(terminal_color_codes.background.red, e)
    })
}


seed().then(r => {
    console.log("*******------CART SEEDER ENDED------*******")
})
