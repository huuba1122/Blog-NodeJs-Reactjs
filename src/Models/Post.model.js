const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({
    title: { type: String, required: true, trim: true},
    linkImgCap: { type: String },
    content: { type: String, required: true },
    imgPostId: { type: Array},
    tagId:[{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    topic:{ type: Schema.Types.ObjectId, ref: 'Topic' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    view: { type: Number, default: 0},
    reaction: {type: Number, default: 0}
},{
    timestamps: true
});


module.exports = mongoose.model('Post', PostSchema);


