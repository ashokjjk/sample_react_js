
const {accessLog, errorLog} = require('../startup/logging');
const correlationId = require('../logger/correlation-id');

module.exports = function (err, req, res, next) {
    accessLog.info('In Error Middleware');
    // Note : Need to remove req. body and params from logging in production
    errorLog.error(err.message, { meta: { corrID: correlationId.getId(),reqBody:req.body, reqParam: req.params, err:err}} );
    res.status(500).send(err);
}