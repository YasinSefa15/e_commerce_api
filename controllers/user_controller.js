const user = require('../models/user')
const {successful_read, server_error} = require("../helpers/response_helper");
const logger = require("../logs/logger");

exports.users = async (req, res) => {
    await user.findAll().then((result) => {
        successful_read(result, res, "All registered users listed")
    })
        .catch(function (error) {
            logger.error(error)
            server_error(res)
        });
}
