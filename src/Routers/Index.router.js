const { authPage } = require('../middleware/authPage');

const userRouters = require('./User.router');
const authRouters = require('./Auth.router');
const postRouters = require('./Post.router');
const commentRouters = require('./Comment.router');
const topicRouters = require('./Topic.router');
const tagRouters = require('./Tag.router');

const router = (app) => {
    app.use('/user', userRouters);
    app.use('/post', postRouters);
    app.use('/comment', commentRouters);
    app.use('/topic', topicRouters);
    app.use('/tag', tagRouters);
    app.use('/', authRouters);
}

module.exports = router;