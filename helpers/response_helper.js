const HTTP_STATUS_CODES = require("./http_status_codes");


const too_many_request = (res) => {
    res.status(HTTP_STATUS_CODES.TOO_MANY_REQUEST).json({
        "status_code": HTTP_STATUS_CODES.TOO_MANY_REQUEST,
        "message": "Too many requests, please try again later"
    })
}

const token_required = (res) => {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        "status_code": HTTP_STATUS_CODES.UNAUTHORIZED,
        "message": "Token is required for this process"
    })
}

const invalid_token = (res) => {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
        "status_code": HTTP_STATUS_CODES.UNAUTHORIZED,
        "message": "Invalid token"
    })
}

const successful_login = (data, res, token, message = "Logged in successfully") => {
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
    too_many_request,
    token_required,
    invalid_token,
    unsuccessful,
    successful_login,
    successful_read,
    successful_create,
    server_error
}