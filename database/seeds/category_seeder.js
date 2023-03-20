console.log("*******------CATEGORY SEEDER STARTED------*******")

const category_factory = require(__dirname + '/../factories/category_factory.js')
const {run_query} = require(__dirname + '/../seeds/seeder.js')
const {terminal_color_codes} = require("../../helpers/colors");
const {client} = require("../../redis");
const {categories_list} = require("../../models/category");


const seed = async () => {
    const inputs = await category_factory.queries(1)
        .then(r => {
            console.log("*******------CATEGORY SEEDER INPUTS------*******")
            //console.log(r)
            return r
        })
    console.log("*******------CATEGORY SEEDER INPUTSxxx------*******")
    //console.log(inputs)

    run_query(inputs).then(async r => {
            console.log(terminal_color_codes.background.green, "Database Successfully Seeded")
            const all_categories = await run_query({queries: "SELECT * FROM categories", fields: []}).then(r => {
                return r
            })
                .catch(e => {

                })

            //seeder closes sql connection, so we need to comment the line
            console.log("*******------CATEGORY SEEDER INPUTSxxxx------*******aslkdlaksdlşasjdşlasjd")
            const categories = categories_list(all_categories)
            console.log(categories)
            await client.connect()
            await client.set("Categories", JSON.stringify(categories))
            await client.quit()
        }
    ).catch(e => {
        console.log(terminal_color_codes.background.red, "Database Seeding Failed")
        console.log(terminal_color_codes.background.red, e)
    })
        .then(async () => {
            console.log(terminal_color_codes.background.gray, "*******------CATEGORY SEEDER ENDED------*******")
        })


}

seed().then(r => {
    console.log("*******------CATEGORY SEEDER ENDEDXXXX------*******")
})