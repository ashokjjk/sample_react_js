const { validationResult } = require('express-validator');
const { accessLog } = require('../startup/logging');
const { throw400Error } = require('../utils');


module.exports = (req, res, next) => {
    accessLog.info('In Validation Middleware');
    const errors = validationResult(req);
    if (req.method == 'POST' && req.originalUrl.indexOf('/api/auth/login') !== -1) {
        if (!errors.isEmpty()) {
            if (req.body.refresh) {
                return next();
            }
        }
    }
    if (!errors.isEmpty()) {
        accessLog.info(`Validation Error: ${JSON.stringify(errors)}`);
        return throw400Error(req, res, errors.array()[0].msg, 2001);
    };

    next();
};