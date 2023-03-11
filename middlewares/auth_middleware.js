const jwt = require("jsonwebtoken");
const {token_required, invalid_token} = require("../helpers/response_helper");
const auth_token = require("../models/auth_token");

const auth_middleware = (req, res, next) => {
    const config = process.env

    let token = req.headers["authorization"]

    if (!token) {
        token_required(res)
    } else {
        token = token.split(" ")[1]

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