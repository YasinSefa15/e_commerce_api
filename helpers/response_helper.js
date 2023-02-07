const successful_read = (data, res, message = "Successful") => {
    res.status(200).json({
        "status_code": 200,
        "message": message,
        "data": data
    })
}

const successful_create = (res, message = "Successful") => {
    res.status(201).json({
        "status_code": 201,
        "message": message
    })
}

const server_error = (res) => {
    res.status(500).json({
        "status_code": 500,
        "message": "An error occurred"
    })
}


module.exports = {
    successful_read,
    successful_create,
    server_error
}