const userRouters = require('./User.router');
const authRouters = require('./Auth.router');
const postRouters = require('./Post.router');

const router = (app) => {
    app.use('/user', userRouters);
    app.use('/post', postRouters);
    app.use('/', authRouters);
}

module.exports = router;