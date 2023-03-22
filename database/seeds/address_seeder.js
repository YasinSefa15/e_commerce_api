const address_factory = require(__dirname + '/../factories/address_factory.js')
const {run_query} = require(__dirname + '/../seeds/seeder.js')
const {terminal_color_codes} = require("../../helpers/colors")

console.log("*******------ADDRESS SEEDER STARTED------*******")



const seed = async () => {
    let inputs = await address_factory.queries(200)
    inputs.close_connection = true
    run_query(inputs).then(async r => {
        console.log(terminal_color_codes.background.green, "Database Successfully Seeded")
    }).catch(e => {
        console.log(terminal_color_codes.background.red, "Database Seeding Failed")
        console.log(terminal_color_codes.background.red, e)
    })
}


seed().then(r => {
    console.log("*******------ADDRESS SEEDER ENDED------*******")
})
