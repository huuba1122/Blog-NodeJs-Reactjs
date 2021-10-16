const Tag = require('../Models/Tag.model');
const createError = require('http-errors');
const handelErrors = require('../helpers/handle_error');

const TagController = { 
    getAll:  async (req, res, next) => {
        try {
            const tags = await Tag.find({});
            res.json({
                status: 'success',
                data: {
                    tags
                }
            });
        } catch (error) {
            next(error);
        }
    },
    
    create:  async (req, res, next) => {
        try {
            const tags = req.body.tags;
            if(!Array.isArray(tags) || tags.length < 1) throw createError.BadRequest('Enter your tag name!');
            const saveTag = await Tag.insertMany(tags);    
            res.json({
                status: 'success',
                tag: saveTag
            })
        } catch (error) {
            next(handelErrors(error));
        }     
    },

    delete: async (req, res, next) => {
        const tagId = req.params.id
        const tag = await Tag.findOne({_id: tagId});
        if(!tag) throw createError.NotFound('Do not find this tag!');
        await tag.deleteOne();

        res.json({
            status: 'success'
        })
    }
}

module.exports = TagController;