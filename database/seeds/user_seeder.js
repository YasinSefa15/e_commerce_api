console.log("*******------USER SEEDER STARTED------*******")

const user_factory = require(__dirname + '/../factories/user_factory.js')
const {run_query} = require(__dirname + '/../seeds/seeder.js')
const {terminal_color_codes} = require("../../helpers/colors");

const inputs = user_factory.queries(50)
inputs.close_connection = true

run_query(inputs).then(r => {
    console.log(terminal_color_codes.background.green, "Database Successfully Seeded")
}).catch(e => {
    console.log(terminal_color_codes.background.red, "Database Seeding Failed")
    console.log(terminal_color_codes.background.red, e)
})
    .then(() => {
        console.log(terminal_color_codes.background.gray, "*******------USER SEEDER ENDED------*******")
    })

