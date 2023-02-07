const successful_read = (data, res, message = "Successful") => {
    res.status(200).json({
        "status_code": 200,
        "message": message,
        "data": data
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
    server_error
}