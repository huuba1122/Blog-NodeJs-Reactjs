const createHttpError = require('http-errors');
const JWT = require('jsonwebtoken');
const clientRedis = require('../configs/db/connections_redis');
require('dotenv').config();

const signAccessToken = async (userId, role) => {
    return new Promise( (resolve, reject) => {
        const payload = {
            userId,
            role
        };

        const secretKey = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: "1h"
        };
        JWT.sign(payload, secretKey, options, (err, token) => {
            if(err) reject(err);
            resolve(token);
        });
    })
};

const signRefreshToken = async (userId) => {
    return new Promise( (resolve, reject) => {
        const payload = {
            userId
        };

        const secretKey = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: "2h"
        };
        JWT.sign(payload, secretKey, options, (err, token) => {
            if(err) reject(err);
            clientRedis.set(userId.toString(), token, 'EX', 2*60*60, (err, reply) => {
                if(err) reject(err);
                console.log(`Call redis::${reply}`);
                resolve(token);
            })
        });
    })
};

const verifyAccessToken = (req, res, next) => {
    if(!req.headers['authorization']) {
        return next(createHttpError.Unauthorized());
    }
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if(err){
            return next(createHttpError.Unauthorized(err.message));
        }
        req.payload = payload;
        // console.log(req.payload);
        next();
    });
};

const verifyRefreshToken = async (refreshToken) => {
    return new Promise( (resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
            if(err) reject(err);

            clientRedis.get(payload.userId, (err, reply) => {
                if(err) reject(createHttpError.InternalServerError());
                if(refreshToken === reply){
                    resolve(payload);
                }
                reject(createHttpError.Unauthorized());
            })
        });
    });
};

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}