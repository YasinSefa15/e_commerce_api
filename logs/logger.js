const {createLogger, transports, format} = require('winston');

const custom_format = format.combine(format.timestamp(),format.printf((info) => {
    return info.timestamp + " " + info.message + " "
}))

const logger = createLogger({
    level: 'error',
    format: custom_format,
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        //
        new transports.File({filename: 'error.log', level: 'error'})
    ],
});


module.exports = logger