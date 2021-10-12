const User = require('../Models/User.model');
const createError = require('http-errors');
const { emailValidate } = require('../helpers/validation');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_service');
const clientRedis = require('../configs/db/connections_redis');

const UserController = {
    login: async (req, res, next) => {
        try {
            const {email, password } = req.body;
            const { error } = emailValidate(email);
            if(error) throw createError(error.details[0].message);
            const user = await User.findOne({
                email
            });
            if(!user) throw createError.NotFound('User not registered');
            if(!password) throw createError('Enter your password!!');
            
            const isValid = await user.checkPassword(password);
            if(!isValid) throw createError.Unauthorized();
            const accessToken = await signAccessToken(user._id, user.role);
            const refreshToken = await signRefreshToken(user._id);
            return res.json({
                status: 'success',
                accessToken,
                refreshToken,
                user
            });
        } catch (error) {
            next(error);
        }
    },

    register: async (req, res, next) => {
        try {
            const {email , name, password, role } = req.body;
            const { error } = emailValidate(email);
            if(error) throw createError(error.details[0].message);
            const isExits = await User.findOne({
                email
            });     

            if(isExits) throw createError.Conflict(`${email} is ready been register!`);

            const user = new User({
                email,
                role,
                name,
                password
            });

            const saveUser = await user.save();

            return res.json({
                status: 'success',
                user  : saveUser
            })

        } catch (error) {
            next(error);
        }
    },

    getAll:  async (req, res, next) => {

        try {
            const users = await User.find({});
            return res.json({
                status: 'success',
                users : users
            })

        } catch (error) {
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if(!refreshToken) throw createError.BadRequest();
            const {userId} = await verifyRefreshToken(refreshToken);
            clientRedis.del(userId.toString(), (err, reply) => {
                if(err) throw createError.InternalServerError();
                res.json({
                    status: 'success'
                })
            })
        } catch (error) {
            next(error);
        }
    },

    refreshToken:  async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if(!refreshToken) throw createError.BadRequest();
            const {userId} = await verifyRefreshToken(refreshToken);
            const user = await User.findOne({
                _id: userId
            });
            if(!user) throw createError.NotFound('User not registered');
            const accessToken = await signAccessToken(user._id, user.role);
            const newRefreshToken = await signRefreshToken(user._id);
            res.json({
                accessToken,
                refreshToken: newRefreshToken
            })
        } catch (error) {
            next(error);
        }
    }
};

module.exports = UserController;