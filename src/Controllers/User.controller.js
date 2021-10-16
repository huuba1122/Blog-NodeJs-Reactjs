const User = require('../Models/User.model');
const createError = require('http-errors');
const { emailValidate, userValidate } = require('../helpers/validation');
// const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_service');
// const clientRedis = require('../configs/db/connections_redis');
const fileGoogle = require('../helpers/google_api');
const fs = require('fs');

const UserController = {
    getById:  async (req, res, next) => {

        try {
            const user = await User.findOne({_id: req.params.id}).select('-password');
            if(!user) throw createError.NotFound('User have not registered');
            return res.json({
                status: 'success',
                data: {user}
            })
        } catch (error) {
            next(error);
        }
    },
    getAll:  async (req, res, next) => {

        try {
            const users = await User.find({}).select('-password');
            if(!users) throw createError.NotFound('User have not registered');
            return res.json({
                status: 'success',
                data: {users}
            })
        } catch (error) {
            next(error);
        }
    },

    update:  async (req, res, next) => {
        try {
            const {email} = req.body;
            const { userId } = req.payload;
            if(!req.params.id || req.params.id !== userId) throw createError.Unauthorized('Wrong user info!');
            if(email){
                const { error } = emailValidate(email);
                if(error) throw createError(error.details[0].message);
                const isExit = await User.findOne({_id : {$ne: userId}, email: email});
                // console.log(isExit);
                if(isExit) throw createError.Conflict(`${email} is ready been register!`);
            }
            const user = await User.findOneAndUpdate({_id: userId}, req.body, {new: true}).select('-password');
            res.json({
                status: 'success',
                data: {user}
            });
        } catch (error) {
            next(error);
        }
    },

    updateAvatar:  async (req, res, next) => {
        try {
            const fileName = req.file.filename;
            const mimeType = req.file.mimetype;

            const googleFile = await fileGoogle.upload(fileName, mimeType);
            // console.log(googleFile);
            if(!googleFile || !googleFile.linkView) throw createError.InternalServerError();
            const user = await User.findOneAndUpdate(
                {_id: req.params.id},
                {avatarId: googleFile.id, avatarViewLink: googleFile.linkView}, 
                {new: true}
                );
            fs.unlink(req.file.path, (err) => {
                if(err) console.log(err);
            });
            res.json({
                status: 'success',
                data: {avatarFile: googleFile}
            })
        } catch (error) {
            next(error);
        }
    }
};

module.exports = UserController;