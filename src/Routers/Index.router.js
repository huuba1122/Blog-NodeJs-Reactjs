const userRouters = require('./User.router');
const authRouters = require('./Auth.router');

const router = (app) => {
    app.use('/user', userRouters);
    app.use('/', authRouters);
}

module.exports = router;