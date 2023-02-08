const HTTP_STATUS_CODES = require("./http_status_codes");

const successful_login = (data, res, message = "Logged in successfully", token) => {
    res.status(HTTP_STATUS_CODES.OK).json({
        "status_code": HTTP_STATUS_CODES.OK,
        "message": message,
        "data": data,
        "token": token
    })
}

const unsuccessful = (res, message = "Error") => {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
        "status_code": HTTP_STATUS_CODES.BAD_REQUEST,
        "message": message
    })
}

const successful_read = (data, res, message = "Successful") => {
    res.status(HTTP_STATUS_CODES.OK).json({
        "status_code": HTTP_STATUS_CODES.OK,
        "message": message,
        "data": data
    })
}

const successful_create = (res, message = "Successful") => {
    res.status(HTTP_STATUS_CODES.CREATED).json({
        "status_code": HTTP_STATUS_CODES.CREATED,
        "message": message
    })
}

const server_error = (res) => {
    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        "status_code": HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        "message": "An error occurred"
    })
}


module.exports = {
    unsuccessful,
    successful_login,
    successful_read,
    successful_create,
    server_error
}