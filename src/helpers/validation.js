const Joi = require('joi');

const emailValidate = email => {
    const EmailSchema = Joi.object ({
        email: Joi.string().email().lowercase().required()
    });

    return EmailSchema.validate({ email });
}

const userValidate = user => {
    const UserSchema = Joi.object ({
        email: Joi.string().email().lowercase().required(),
        name: Joi.string().required().max(100),
        password: Joi.string().required().min(6)
    });

    return UserSchema.validate(user);
}

const postValidate = post => {
    const PostSchema = Joi.object ({
        title: Joi.string().required(),
        linkImgCap: Joi.string(),
        content: Joi.string().required(),
        imgPostId: Joi.array(),
        tagId: Joi.array(),
        topic: Joi.string(),
        userId: Joi.string().required(),
        view: Joi.number(),
        reaction: Joi.number(),
    });

    return PostSchema.validate(post);
}

const commentValidate = comment => {
    const CommentSchema = Joi.object ({
        content: Joi.string().required(),
        userId: Joi.string().required(),
        postId: Joi.string().required(),
        reply: Joi.array()
    });

    return CommentSchema.validate(comment);
}

module.exports = {
    emailValidate,
    userValidate,
    postValidate,
    commentValidate
}