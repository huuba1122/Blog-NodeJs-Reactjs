const mongoose = require('mongoose');
require('dotenv').config();

const { MONGO_HOST, MONGO_PORT, MONGO_NAME } = process.env;
const _URL = `mongodb://${MONGO_HOST}:${ MONGO_PORT}/${MONGO_NAME}`;

async function connect() {
    try {
        await mongoose.connect(_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true
        });

        console.log("connect successfully!");
    } catch (error) {
        console.log("connect failure");
    }
}

module.exports = { connect };

// connection multi db
// const conn = mongoose.createConnection(`mongodb://${MONGO_HOST}:${ MONGO_PORT}/${MONGO_NAME}`);

// conn.on('connected', function () {
//     console.log(`MongoDb::connected::${this.name}`);
// });

// conn.on('disconnected', function () {
//     console.log(`MongoDb::disconnected::${this.name}`);
// });

// conn.on('error', function (error) {
//     console.log(`MongoDb::error::${error}`);
// });

// process.on('SIGINT', async() =>{
//     await conn.close();
//     process.exit(0);
// })


// module.exports = conn;
