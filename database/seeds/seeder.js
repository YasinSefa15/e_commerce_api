const connection = require(__dirname + "/../../db")

const run_query = async (input) => {
    return await new Promise(async (resolve, reject) => {
        connection.query(input.queries, input.fields, async (err, result) => {
            console.log("*******------RUN QUERY ENDED------*******")
            //console.log(input.fields)
            //await connection.end()
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

exports.run_query = run_query