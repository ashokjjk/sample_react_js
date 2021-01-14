const morgan = require('morgan');
const { accessLog, errorLog } = require('../startup/logging');

const morganConfig = {
    stream: {
        write: (text) => accessLog.info(text.trim()),
    },
};

const requestLoggingMiddleware = [
    morgan(':method :url', { ...morganConfig, immediate: true }),
    morgan(':method :status :url (:res[content-length] bytes) :response-time ms', { ...morganConfig, immediate: false }),
];

module.exports = { requestLoggingMiddleware };
