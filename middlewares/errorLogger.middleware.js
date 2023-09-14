const winston = require('winston');

const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: 'error.log', level: 'error' })],
});

if (process.env.NODE_ENV !== 'production') {
    errorLogger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    );
}

module.exports = errorLogger;
