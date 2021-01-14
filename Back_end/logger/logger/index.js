const winston = require(`winston`);
require('express-async-errors');
require('winston-mongodb');
const path = require('path');
const filename = path.join(__dirname, '/../../logs/created-logfile.log');
if (process.env.NODE_ENV === "test") {
    // export
    const accessLogger = (opts = {}) => {
        const {
            level = `info`,
            getCorrelationId,
            noCorrelationIdValue = `nocorrelation`,
        } = opts;
        return winston.createLogger({
            format: winston.format.combine(
                winston.format((info) => {
                    info.correlationId = getCorrelationId() || noCorrelationIdValue;
                    return info;
                })(),
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, correlationId, level, message }) => {
                    return `${timestamp} (${correlationId}) - ${level}: ${message}`;
                })
            ),
            level,
            transports: [
                new winston.transports.Console({
                    handleExceptions: true,
                })
            ],
            exitOnError: false,
        })
    }
    const errorLogger = (opts = {}) => {
        return;
    }
    module.exports = { accessLogger, errorLogger };
}
else {
    const accessLogger = (opts = {}) => {
        const {
            level = `info`,
            getCorrelationId,
            noCorrelationIdValue = `nocorrelation`,
        } = opts;

        return winston.createLogger({
            format: winston.format.combine(
                winston.format((info) => {
                    info.correlationId = getCorrelationId() || noCorrelationIdValue;
                    return info;
                })(),
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, correlationId, level, message }) => {
                    return `${timestamp} (${correlationId}) - ${level}: ${message}`;
                })
            ),
            level,
            transports: [
                new winston.transports.Console({
                    handleExceptions: true,
                }),
                new winston.transports.File({
                    level: 'info',
                    filename: filename,
                    handleException: true,
                    json: true,
                    maxSize: 5242880, //5mb
                    maxFiles: 2,
                    colorize: false
                }),
            ],
            exitOnError: false,
        })
    
    }

    const errorLogger = (opts = {}) => {
        const {
            level = `info`,
            getCorrelationId,
            noCorrelationIdValue = `nocorrelation`,
        } = opts;

        return winston.createLogger({
            format: winston.format.combine(
                winston.format((info) => {
                    info.correlationId = getCorrelationId() || noCorrelationIdValue;
                    return info;
                })(),
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.printf(({ timestamp, correlationId, level, message }) => {
                    return `${timestamp} (${correlationId}) - ${level}: ${message}`;
                })
            ),
            meta: { correlationId: getCorrelationId() || noCorrelationIdValue },
            level,
            transports: [
                // new winston.transports.MongoDB({
                //     db: process.env.MONGO_LOCAL_CONN_URL,
                //     level: 'info'
                // }),
                new winston.transports.File({
                    level: 'info',
                    filename: filename,
                    handleException: true,
                    json: true,
                    maxSize: 5242880, //5mb
                    maxFiles: 2,
                    colorize: false
                }),
                new winston.transports.Console({
                    level: 'debug',
                    handleException: true,
                    json: false,
                    colorize: true,
                    prettyPrint: true,
                    format: winston.format.combine(
                        winston.format((info) => {
                            info.correlationId = getCorrelationId() || noCorrelationIdValue;
                            return info;
                        })(),
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.errors({ stack: true }),
                        winston.format.printf(({ timestamp, correlationId, level, message }) => {
                            return `${timestamp} (${correlationId}) - ${level}: ${message}`;
                        })
                    )
                })
            ],
            exitOnError: false,
        })
    }


    module.exports = { accessLogger, errorLogger };
}
