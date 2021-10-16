const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const { Schema } = mongoose;

const PostSchema = new Schema({
    title: { type: String, required: true, trim: true},
    linkImgCap: { type: String, default: '' },
    content: { type: String, required: true },
    imgPostId: { type: Array},
    tagId:[{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    topicId:{ type: Schema.Types.ObjectId, ref: 'Topic' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    quantityComment: { type: Number, default: 0},
    view: { type: Number, default: 0},
    reaction: {
        quantity: {type: Number, default: 0},
        users: {type: Array, default: []}
    },
    slug: {type: String, slug: 'title'}
},{
    timestamps: true
});


module.exports = mongoose.model('Post', PostSchema);


