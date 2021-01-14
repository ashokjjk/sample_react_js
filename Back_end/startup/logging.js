const correlationId = require('../logger/correlation-id');
const { accessLogger, errorLogger }= require('../logger/logger');

const accessLog = accessLogger({
    getCorrelationId: correlationId.getId,
});

const errorLog = errorLogger({
    getCorrelationId: correlationId.getId,
});

process.on('uncaughtException', (ex) => {
    accessLog.error(ex.message, { meta: ex });
    process.exit(1);
});

process.on('unhandledRejection', (ex) => {
    throw ex;
});


module.exports = { accessLog, errorLog };
