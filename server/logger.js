const winston = require('winston');

const environment = process.env.NODE_ENV || 'development';

let logLevel;
if (environment === 'production') {
    logLevel = 'error';
} else {
    logLevel = 'info';
}

const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })
);

const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({
            format: logFormat
        })
    ]
});

module.exports = logger;
