require('dotenv').config();
const express = require('express');
const { accessLog } = require('./startup/logging');

//=== 1 - CREATE APP
// Creating express app and configuring middleware needed for authentication
const app = express();
require('./startup/routes')(app);
//=== 4 - SET UP DATABASE
require('./startup/db')();
//=== 5 - START SERVER
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => accessLog.info('Server running on http://localhost:'+PORT+'/'));
const io = require('./socket').init(server);
io.on('connection', socket => {
    socket.on('join',  (data) => {
        socket.join(data.email); // We are using room of socket io
    });
});
module.exports = server;