const Post = require('../Models/Post.model');
const createError = require('http-errors');

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
            const posts = await Post.find({});
            if(!posts) throw createError.NotFound('post have not registered');
            return res.json({
                status: 'success',
                data: {posts}
            })
        } catch (error) {
            next(error);
        }
    },

    update:  async (req, res, next) => {
        try {
            const {email} = req.body;
            const { postId } = req.payload;
            if(!req.params.id || req.params.id !== postId) throw createError.Unauthorized('Wrong post info!');
            if(email){
                const { error } = emailValidate(email);
                if(error) throw createError(error.details[0].message);
                const isExit = await post.findOne({_id : {$ne: postId}, email: email});
                console.log(isExit);
                if(isExit) throw createError.Conflict(`${email} is ready been register!`);
            }
            const post = await post.findOneAndUpdate({_id: postId}, req.body, {new: true});
            res.json({
                status: 'success',
                data: {post}
            });
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