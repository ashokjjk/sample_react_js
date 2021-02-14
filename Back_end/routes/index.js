const ingredients = require('./ingredients');
module.exports = app => {
    // app.get('/', (req, res) => {
    //     res.status(200).send({ message: "Welcome to the AUTHENTICATION API" });
    // });
    app.use('/api', ingredients);
};