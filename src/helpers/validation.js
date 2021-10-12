const Joi = require('joi');

const emailValidate = email => {
    const emailSchema = Joi.object ({
        email: Joi.string().email().lowercase().required()
    });

    return emailSchema.validate({ email });
}


module.exports = {
    emailValidate
}