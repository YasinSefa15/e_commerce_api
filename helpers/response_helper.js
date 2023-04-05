const HTTP_STATUS_CODES = require("./http_status_codes")
require('dotenv').config({path: __dirname + '/../.env'})
const logger = require("../logs/logger");

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

const successful_read = (data, res, message = "Successful", metadata = {}) => {
    let response = {
        "status_code": HTTP_STATUS_CODES.OK,
        "message": message,
        "data": data
    }

    if (Object.keys(metadata).length) {
        response.meta_data = metadata
    }

    res.status(HTTP_STATUS_CODES.OK).json(response)
}

const successful_create = (res, message = "Successful") => {
    res.status(HTTP_STATUS_CODES.CREATED).json({
        "status_code": HTTP_STATUS_CODES.CREATED,
        "message": message
    })
}

const update_or_delete_response = (affected_rows_count, res) => {
    if (affected_rows_count) {
        res.status(HTTP_STATUS_CODES.OK).json({
            "status_code": HTTP_STATUS_CODES.OK,
            "message": "Successful"
        })
    } else {
        res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
            "status_code": HTTP_STATUS_CODES.BAD_REQUEST,
            "message": "No record found"
        })
    }
}

const not_found = (res) => {
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        "status_code": HTTP_STATUS_CODES.NOT_FOUND,
        "message": "Not Found"
    })
}

const server_error = (res, err = []) => {
    logger.error(err)
    console.log(err)

    if (process.env.NODE_ENV === "development") {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            "status_code": HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            "message": "An error occurred",
            "error": err,
            "stack": err.stack
        })
    } else {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            "status_code": HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
            "message": "An error occurred"
        })
    }
}


module.exports = {
    too_many_request,
    token_required,
    invalid_token,
    unsuccessful,
    successful_login,
    update_or_delete_response,
    successful_read,
    successful_create,
    not_found,
    server_error
}