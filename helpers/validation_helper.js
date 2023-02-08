const HTTP_STATUS_CODES = require("./http_status_codes");

const validate_or_throw_error = function (schema, body, res) {
    const {error, value} = schema.validate(body, {abortEarly: false, errors: {wrap: {label: ''}}})

    if (error) {
        throw res.status(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            "message": "Please check your form",
            "errors": error.details.map((msg) => {
                return {[msg.path]: msg.message}
            })
        })
    }
}

module.exports = {
    validate_or_throw_error
}