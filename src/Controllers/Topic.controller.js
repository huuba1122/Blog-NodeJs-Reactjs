const Topic = require('../Models/Topic.model');
const createError = require('http-errors');
const handelErrors = require('../helpers/handle_error');

const TopicController = { 
    getAll:  async (req, res, next) => {
        try {
            const topics = await Topic.find({});
            res.json({
                status: 'success',
                data: {
                    topics
                }
            });
        } catch (error) {
            next(error);
        }
    },

    create:  async (req, res, next) => {
        try {
            const topics = req.body.topics;
            if(!Array.isArray(topics) || topics.length < 1) throw createError.BadRequest('Enter your topic name!');

            const saveTopic = await Topic.insertMany(topics);
    
            res.json({
                status: 'success',
                Topic: saveTopic
            })
        } catch (error) {
            next(handelErrors(error));
        }     
    },

    delete: async (req, res, next) => {
        try {
            const topicId = req.params.id
            const topic = await Topic.findOne({_id: topicId});
            if(!topic) throw createError.NotFound('Do not find this topic!');
            await topic.deleteOne();
    
            res.json({
                status: 'success'
            })
        } catch (error) {
            next(error);
        }
    }
}

module.exports = TopicController;