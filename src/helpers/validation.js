const Joi = require('joi');

const emailValidate = email => {
    const emailSchema = Joi.object ({
        email: Joi.string().email().lowercase().required()
    });

    return emailSchema.validate({ email });
}

const userValidate = user => {
    const userSchema = Joi.object ({
        email: Joi.string().email().lowercase().required(),
        name: Joi.string().required().max(100),
        password: Joi.string().required().min(6)
    });

    return userSchema.validate(user);
}


module.exports = {
    emailValidate,
    userValidate
}