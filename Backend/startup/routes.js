const express = require('express');
const cors = require('cors');
const error = require('../middlewares/error');
const passport = require("passport");
const path = require("path");
const { requestLoggingMiddleware } = require('../middlewares/request-logging-middleware');
const { correlationIdMiddleware } = require('../middlewares/correlation-id-middleware');
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);
// const csrf = require('csurf');

module.exports = function(app) {
    app.use(correlationIdMiddleware);
    app.use(requestLoggingMiddleware);
    app.use((req, res, next) => {
        setTimeout(() => {
            next();
        }, Math.random() * 300);
    });

    app.use(cors());

    // for parsing application/json
    app.use(express.json());

    // for parsing application/xwww-
    app.use(express.urlencoded({ extended: false }));
    //form-urlencoded

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');




    //=== 3 - CONFIGURE ROUTES
    //Configure Route
    require('../routes/index')(app);
    app.use(error);
}