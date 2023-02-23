const {createLogger, transports, format} = require('winston');

const custom_format = format.combine(format.timestamp(), format.printf((info) => {
    return info.timestamp + " " + info.stack
}))

const logger = createLogger({
    level: 'error',
    format: custom_format,
    transports: [
        new transports.File({filename: './logs/files/error.log', level: 'error'})
    ],
});


module.exports = logger