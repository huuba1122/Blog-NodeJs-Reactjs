const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST
});

client.ping((err, pong) => {
    if(err) console.log(`Redis::error:: ${err}`);
    console.log(pong);
})

client.on('error', function(error) {
    console.log(error);
});

client.on('connect', function() {
    console.log(`Redis::connected`);
})

client.on('ready', function() {
    console.log(`Redis to ready`);
})

module.exports = client;


