const jwt = require("jsonwebtoken");
const {token_required, invalid_token} = require("../helpers/response_helper");
const auth_token = require("../models/auth_token");

const auth_middleware = (req, res, next) => {
    const config = process.env

    const token = req.headers["x-access-token"]

    if (!token) {
        token_required(res)
    } else {
        try {
            req.auth = jwt.verify(token, config.TOKEN_KEY)

            auth_token.update(req.auth.uuid)

            return next()
        } catch (err) {
            invalid_token(res)
        }
    }
}


module.exports = auth_middleware