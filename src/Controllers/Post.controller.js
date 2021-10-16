const Post = require('../Models/Post.model');
const createError = require('http-errors');
const { postValidate } = require('../helpers/validation');
const url = require('url');
const fileGoogle = require('../helpers/google_api');
const fs = require('fs');

const PostController = {
    getById:  async (req, res, next) => {
        try {
            const post = await Post.findOne({_id: req.params.id});
            if(!post) throw createError.NotFound();
            return res.json({
                status: 'success',
                data: {post}
            })
        } catch (error) {
            next(error);
        }
    },

    getAll:  async (req, res, next) => {

        try {
            const _page = +req.query.page;
            const _limit = +req.query.limit;
            const _skip = ( _page -1) * _limit;
            const _sort = req.query.sort || 'createdAt';
            const _sortType = req.query.s_type || 'asc';
            const searchString = req.query.q || '';
            const { _field, f_value } = req.query;
            const fieldFilter = (_field && f_value) ? {[_field]: f_value} : {};
            const textFilter = searchString ? {$or: [{title: new RegExp(`.*${searchString}.*`, 'i')}, {slug: new RegExp(`.*${searchString}.*`, 'i')}]} : {};
            const filter = { $and: [fieldFilter, textFilter]};
            const posts = await Post.find(filter)
                .populate({
                    path: 'userId',
                    select: '_id name email avatarViewLink website'
                })
                .populate({
                    path: 'topicId',
                    select: '_id name'
                })
                .populate({
                    path: 'tagId',
                    select: '_id name email avatarViewLink website'
                })
                .sort({[_sort] : _sortType})
                .skip(_skip)
                .limit(_limit);
            if(!posts) throw createError.NotFound('post have not registered');
            return res.json({
                status: 'success',
                data: {posts}
            })
        } catch (error) {
            next(error);
        }
    },

    create:  async (req, res, next) => {
        try {
            const { error } = postValidate(req.body);
            if(error) throw createError(error.details[0].message);
            const post = new Post({
                ...req.body,
                userId: req.payload.userId
            });
            const savePost = await post.save();
            res.json({
                status: 'success',
                data: {
                    post: savePost
                }
        });
        } catch (error) {
            next(error);
        }
    },

    update:  async (req, res, next) => {
        try {
            const postId = req.params.id;
            if(!postId) throw createError.Unauthorized('Wrong post info!');
            const post = await Post.findOne({_id: postId});
            if(!post) throw createError.NotFound();
            if(!req.body.reaction){
                if(req.payload.userId !== post.userId.toString()) throw createError.Forbidden('You do not permissions edit this post!');
            }
            const updatePost = await post.update(req.body);
            res.json({
                status: 'success',
                data: {updatePost}
            });
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const post = await Post.findOne({_id: req.params.id});
            if(!post) throw createError.NotFound('Not found this post!');
            if(req.payload.userId !== post.userId.toString()) throw createError.Forbidden('You do not permissions delete this post!');
            await post.deleteOne();

            res.json({
                status: 'success',
            })
        } catch (error) {
            next(error);
        }
    },

    uploadFile:  async (req, res, next) => {
        try {
            const fileName = req.file.filename;
            const mimeType = req.file.mimetype;

            const googleFile = await fileGoogle.upload(fileName, mimeType);
            // console.log(googleFile);
            if(!googleFile || !googleFile.linkView) throw createError.InternalServerError();
            fs.unlink(req.file.path, (err) => {
                if(err) console.log(err);
            });
            res.json({
                status: 'success',
                location: googleFile.linkDownload
            })
        } catch (error) {
            next(error);
        }
    }
};

module.exports = PostController;