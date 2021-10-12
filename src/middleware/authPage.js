// const User = require('../Models/User.model');
const createHttpError = require('http-errors');
const authPage = (permissions) => {
    return (req, res, next) => {
        const { role } = req.payload;
        if(!role) throw createHttpError.Unauthorized('You need to sign in!');
        if(!permissions.includes(role))  throw createHttpError.Unauthorized('You dont have permission!');
        next();
    }
}

module.exports = {
    authPage
}