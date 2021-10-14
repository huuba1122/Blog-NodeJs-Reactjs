const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
    content: { type: String, required},
    userId: { type: Schema.Types.ObjectId, ref: "User"},
    postId: { type: Schema.Types.ObjectId, ref: "Post"},
    reply: { type: Array, default: []}
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', CommentSchema);