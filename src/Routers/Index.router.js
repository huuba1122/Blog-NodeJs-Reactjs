const userRouters = require('./User.router');

const router = (app) => {
    app.use('/user', userRouters);
}

module.exports = router;