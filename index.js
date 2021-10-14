const express = require('express');
const cors = require('cors');
const httpError = require('http-errors');
const morgan = require('morgan');
const path = require('path');
const router = require('./src/Routers/Index.router');
const db = require('./src/configs/db/connections_mongdb');

const app = express();
app.use(cors())
// env
require('dotenv').config();
//connect db
db.connect();
//connect redis;
// require('./src/configs/db/connections_redis');

// http logs
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// request
router(app);


const PORT = process.env.PORT || 3001;
//static url
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res, next) => {
    res.send('home page');
})

app.use((req, res, next) => {
    next(httpError.NotFound('This page is not found!'))
})

app.use((err, req, res, next) => {
    res.json({
        status: err.status || 500,
        message: err.message
    })
})



app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})