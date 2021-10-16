const Comment = require('../Models/Comment.model');
const createError = require('http-errors');
const { commentValidate } = require('../helpers/validation');
const Post = require('../Models/Post.model');

const CommentController = {
    create:  async (req, res, next) => {
        // const session = await db.startSession();
        // session.startTransaction();
        try {
            const { error } = commentValidate(req.body);
            if(error) throw createError(error.details[0].message);
            const comment = new Comment({
                ...req.body,
                user: req.payload.userId
            })
            const saveComment = await comment.save();
            // const saveComment = await comment.save({ session });
            const post = await Post.findOne({_id: req.body.post});
            post.quantityComment += 1;
            await post.save();
            // await post.save({ session});
            // await session.commitTransaction();
            // session.endSession();
            res.json({
                status: 'success',
                data:{
                    comment: saveComment
                }
            })
        } catch (error) {
            // await session.abortTransaction();
            // session.endSession();
            next(error);
        }
    },

    update:  async (req, res, next) => {
        try {
            const id = req.query.id;
            const type = req.query.type;
            const action = req.query.action;
            let body = req.body;
            if(!id) throw createError.BadRequest();
            const comment = await Comment.findOne({_id: id});
            if(!comment) throw createError.NotFound();
            if(req.payload.userId !== comment.user.toString()) {                
                throw createError.Forbidden('You dont have permission edit this comment!');
            }
            if(type === 'reply'){
                const post = await Post.findOne({_id: comment.post});
                const replies = comment.replies;
                if(action === 'add'){
                    const reply = {
                        content: req.body.content,
                        user: req.payload.userId
                    }
                    replies.push(reply);
                    body = { replies };
                    post.quantityComment += 1;
                } else if(action === 'remove'){
                    const removeReplies = replies.filter( reply => reply._id.toString() !== body.replyId);
                    body = { replies: removeReplies };
                    post.quantityComment -= 1;
                } else if (action === 'edit') {
                    replies.forEach(reply => {
                        if(reply._id.toString() === body.replyId) reply.content = req.body.content;
                        return reply;
                    });
                    body = { replies };
                }
                await post.save();
            }
            await comment.updateOne(body);
            res.json({
                status: 'success',
            })
        } catch (error) {
            next(error);
        }
    },

    get:  async (req, res, next) => {
        try {
            const _page = +req.query.page;
            const _limit = +req.query.limit;
            const _skip = ( _page -1) * _limit;
            const userId = req.query.user_id;
            const postId = req.query.post_id;
            const filter = postId ? { field : 'post', value: postId } : { field : 'user', value: userId }
            if(!filter.value) throw createError.BadRequest('Send your post id or user id!');
            const comments = await Comment.find({[filter.field]: filter.value}).skip(_skip).limit(_limit).sort({createdAt: 'asc'});
            res.json({
                status: 'success',
                data: {
                    comments
                }
            })
        } catch (error) {
            next(error);
        }
    },

    getById:  async (req, res, next) => {
        try {
            const id = req.params.id;
            const comment = await Comment.findOne({_id: id});
            res.json({
                status: 'success',
                data: {
                    comment
                }
            })
        } catch (error) {
            next(error);
        }
    },

    delete:  async (req, res, next) => {
        try {
            const id = req.params.id;
            if(!id) throw createError.BadRequest();
            const comment = await Comment.findOne({_id: id});
            if(!comment) throw createError.NotFound();
            if(req.payload.userId === comment.user.toString() || req.payload.role === 'ADMIN') { 
                const totalComment = comment.replies.length + 1;
                const post = await Post.findOne({_id: comment.post});
                await comment.deleteOne();
                post.quantityComment -= totalComment;
                await post.save();
                res.json({
                    status: 'success',
                })
            } else {
                throw createError.Forbidden('You dont have permission delete this comment!');
            }
        } catch (error) {
            next(error);
        }
    },
};

module.exports = CommentController;
