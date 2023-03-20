const {remove} = require("winston");
module.exports.parse_column_names = (column_names) => {
    return column_names === undefined ? "*" : column_names.join(", ").toString()
}

module.exports.parse_conditions = (conditions) => {
    let query_condition = ' '
    if (conditions !== undefined) {
        query_condition += ''
        //traverse in conditions object by key
        for (const key in conditions) {
            //accessing values
            //console.log("key: " + key)
            if (conditions.hasOwnProperty(key)) {
                console.log(conditions[key])
                //console.log(conditions[key])
                //console.log(conditions[key]['values'])
                //console.log(typeof conditions[key]['values'])

                if (conditions[key]['values'].length === 0) {

                    query_condition += 'where (1=1) '

                    console.log(key + " is empty")
                } else {
                    query_condition += 'where ('
                }

                //creating query string
                conditions[key]['values'].forEach((value) => {
                    query_condition += " " + key + (conditions[key]['operator'] ?? " = ") + value + " "
                    if (conditions[key]['values'].length - 1 !== conditions[key]['values'].indexOf(value)) {
                        query_condition += conditions[key]['condition']
                    } else {
                        query_condition += ') '
                        if (Object.keys(conditions).length - 1 !== Object.keys(conditions).indexOf(key)) {
                            query_condition += ' and '
                        }
                    }
                })
                //console.log(`${key}: ${conditions[key]}`);
            }
        }
    }

    console.log("parsed conditions", query_condition)

    return query_condition
}

exports.parse_nested_conditions = (conditions) => {
    let query_condition = 'where '

    if (conditions !== undefined) {
        //traverse in conditions object by key
        for (const key in conditions) {
            //accessing values
            //console.log("key: " + key)
            if (conditions.hasOwnProperty(key)) {
                const first_key = key.split(",")[0]
                const second_key = key.split(",")[1]
                //console.log(conditions[key])
                //console.log(conditions[key]['values'])

                //console.log(typeof conditions[key]['values'])
                //creating query string
                const values = conditions[key]
                //console.log(conditions[key]["0.values"])
                for (let i = 0; i < values["0.values"].length; i++) {
                    query_condition += "(" + first_key + (values['0.operator'] ?? " = ") + values["0.values"][i]
                        + " " + values["inner_condition"] + " " + second_key + (values['1.operator'] ?? " = ") + values["1.values"][i] + ")"
                    if (values["0.values"].length - 1 !== i) {
                        query_condition += " " + values["outer_condition"] + " "
                    }
                }
            }
        }
    }
    //console.log(query_condition)

    return query_condition
}

exports.parse_multiple_conditions = (conditions) => {
    let query_condition = ``

    if (conditions !== undefined) {
        //traverse in conditions object by key
        for (const key in conditions) {
            //console.log(conditions[key].operation)
            //console.log(conditions[key])

            if (conditions[key].operation === "update") {
                const updatable_column = key.split(",")[0]
                const search_column = key.split(",")[1]
                if (conditions.hasOwnProperty(key)) {
                    for (let i = 0; i < conditions[key]["0.values"].length; i++) {
                        //todo and or or ?
                        if (!conditions[key]["updated_at"] || conditions[key]["updated_at"] !== false) {
                            query_condition += query_condition += `update ${conditions[key].table} set ${updatable_column} = ${updatable_column} - ${conditions[key]["0.values"][i]} ,updated_at = CURRENT_TIMESTAMP() where ${search_column} = ${conditions[key]["1.values"][i]}; `
                        } else {
                            query_condition += `update ${conditions[key].table} set ${updatable_column} = ${updatable_column} - ${conditions[key]["0.values"][i]} where ${search_column} = ${conditions[key]["1.values"][i]}; `
                        }
                    }
                }
            } else if (conditions[key].operation === "insert") {
                //fields - values by order
                if (conditions.hasOwnProperty(key)) {
                    const fields_length = conditions[key].fields.length
                    const values_length = conditions[key].values.length
                    const record_length = values_length / fields_length
                    let fields = conditions[key].fields.join(",").toString()
                    //console.log(fields)

                    //creates all queries,n query
                    for (let j = 0; j < record_length; j++) {
                        query_condition += `insert into ${conditions[key].table} (${fields}) values (`

                        //j is the beginning index of the values
                        for (let i = j * record_length; i < j + record_length; i++) {
                            //console.log(i)
                            //console.log(conditions[key].values[i])
                            query_condition += conditions[key].values[i]
                            if (i % record_length !== 0) {
                                query_condition += ","
                            }
                        }
                        query_condition += `); `
                        //console.log(query_condition)
                    }
                }
            }
        }
    }
    //console.log(query_condition)

    return query_condition
}


module.exports.current_timestamp = {
    toSqlString: function () {
        return 'CURRENT_TIMESTAMP()';
    }
}

exports.bind = (input) => {
    //input.source
    //input with
    //input key name
    //foreign key
    let result = {}

    input.source.forEach((source) => {
        result[source[input.key]] = source
        result[source[input.key]][input.with_key] = []

        input.with.forEach((related_value) => {
            //console.log(source[input.key] + " " + related_value[input.foreign_key])
            if (source[input.key] === related_value[input.foreign_key]) {
                //can be optimized, done related value can be removed from with object
                result[source[input.key]][input.with_key].push(related_value)

            }
        })
    })

    return result
}

exports.pagination_parser = (pagination) => {
    let query_condition = ``
    if (pagination !== undefined) {
        if (!isNaN(pagination.limit) && !isNaN(pagination.offset)) {
            query_condition += `limit ${pagination.limit} offset ${pagination.offset}`
        }
    }

    return query_condition
}