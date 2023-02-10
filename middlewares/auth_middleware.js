const jwt = require("jsonwebtoken");
const {token_required, invalid_token} = require("../helpers/response_helper");

const auth_middleware = (req, res, next) => {
    const config = process.env

    const token = req.headers["x-access-token"]

    if (!token) {
        token_required(res)
    }

    try {
        req.auth_id = jwt.verify(token, config.TOKEN_KEY);
    } catch (err) {
        invalid_token(res)
    }

    return next();
}


module.exports = auth_middleware