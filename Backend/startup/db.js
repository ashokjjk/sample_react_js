const { accessLog, errorLog } = require('../startup/logging');
const mongoose = require('mongoose');

module.exports = function () {
    //=== 2 - SET UP DATABASE
    //Configure mongoose's promise to global promise
    // Setting up port
    accessLog.info("process.env.MONGO_LOCAL_CONN_URL: " + process.env.MONGO_LOCAL_CONN_URL);
    const connUri = process.env.MONGO_LOCAL_CONN_URL;

    mongoose.promise = global.Promise;
    mongoose.connect(connUri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

    const connection = mongoose.connection;
    connection.once('open', () => accessLog.info('MongoDB --  database connection established successfully!'));
    connection.on('error', (err) => {
        errorLog.error("MongoDB connection error. Please make sure MongoDB is running. " + err);
        process.exit();
    });
}