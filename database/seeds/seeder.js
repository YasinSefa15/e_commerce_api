const connection = require(__dirname + "/../../db")

const run_query = async (input) => {
    return await new Promise(async (resolve, reject) => {
        connection.query(input.queries, input.fields, async (err, result) => {
            console.log("*******------RUN QUERY ENDED------*******")
            //console.log(input.fields)
            //console.log(input.queries)
            if (input.close_connection !== undefined && input.close_connection === true) {

                await connection.end()
            }

            if (err) {
                console.log("*******------RUN QUERY FAILED------*******")
                await connection.end()
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.run_query = run_query