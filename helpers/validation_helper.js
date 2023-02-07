const validate_or_throw_error = function (schema, req, res) {
    const {error, value} = helpers.validate(schema, req.body)

    if (error) {
        throw res.status(401).json({
            "message": "Please check your form",
            "errors": error.details.map((msg) => {
                return {[msg.path]: msg.message}
            })
        })
    }

}