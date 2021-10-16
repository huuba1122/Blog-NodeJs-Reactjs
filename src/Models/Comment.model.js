const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
    content: { type: String, required: true},
    user: { type: Schema.Types.ObjectId, ref: "User"},
    post: { type: Schema.Types.ObjectId, ref: "Post"},
    replies: [{
        content: { type: String},
        user: { type: Schema.Types.ObjectId, ref: 'User'}
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);