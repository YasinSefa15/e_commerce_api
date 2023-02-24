module.exports.parse_column_names = (column_names) => {
    return column_names === undefined ? "*" : column_names.join(", ").toString()
}

module.exports.parse_conditions = (conditions) => {
    let query_condition = 'where'
    if (conditions !== undefined) {

        //traverse in conditions object by key
        for (const key in conditions) {
            //accessing values
            if (conditions.hasOwnProperty(key)) {
                //console.log(conditions[key]['condition'])
                //console.log(conditions[key]['values'])

                //creating query string
                conditions[key]['values'].forEach((value) => {
                    query_condition += " " + key + " = " + value + " "
                    if (conditions[key]['values'].length - 1 !== conditions[key]['values'].indexOf(value)) {
                        query_condition += conditions[key]['condition']
                    }
                })
                //console.log(`${key}: ${conditions[key]}`);
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