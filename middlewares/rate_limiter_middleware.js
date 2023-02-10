const rateLimit = require('express-rate-limit')
const {too_many_request} = require("../helpers/response_helper");

const rate_limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 50, // Limit each IP to 50 requests per `window` (here, per 60 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (request, response, next, options) =>
        too_many_request(response)
})

module.exports = rate_limiter
