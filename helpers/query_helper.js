const {remove} = require("winston");
module.exports.parse_column_names = (column_names) => {
    return column_names === undefined ? "*" : column_names.join(", ").toString()
}

module.exports.parse_conditions = (conditions) => {
    let query_condition = 'where ('
    if (conditions !== undefined) {

        //traverse in conditions object by key
        for (const key in conditions) {
            //accessing values
            //console.log("key: " + key)
            if (conditions.hasOwnProperty(key)) {
                //console.log(conditions[key])
                //console.log(conditions[key]['values'])

                //console.log(typeof conditions[key]['values'])
                //creating query string
                conditions[key]['values'].forEach((value) => {
                    query_condition += " " + key + " = " + value + " "
                    if (conditions[key]['values'].length - 1 !== conditions[key]['values'].indexOf(value)) {
                        query_condition += conditions[key]['condition']
                    } else {
                        query_condition += ')'
                    }
                })
                //console.log(`${key}: ${conditions[key]}`);
            }
        }
    }

    console.log(query_condition)

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
                result[source[input.key]][input.with_key].push({related_value})

            }
        })
    })

    return result
}