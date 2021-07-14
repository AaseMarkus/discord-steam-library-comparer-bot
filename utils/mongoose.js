const mongoose = require('mongoose');
require('dotenv').config();
module.exports = {
    init: () => {
        const dboptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4,
        };

        mongoose.connect('mongodb+srv://admin:' + process.env.MONGODB_ADMIN_PASS + '@cluster0.vt1cf.mongodb.net/mortendrageDB?retryWrites=true&w=majority', dboptions);
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', () => {
            console.log("Connected to database");
        });

        mongoose.connection.on('err', err => {
            console.error(`Mongoose connection error: \n${err.stack}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn("Disconnected from database");
        })
    }
}
    
        