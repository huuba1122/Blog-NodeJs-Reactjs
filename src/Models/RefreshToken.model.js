const mongoose = require('mongoose');
// const dbConnection = require('../configs/db/connections_mongdb');

const { Schema } = mongoose;

const RefreshToken = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        unique: true,
        require: true
    },
    refreshToken: {
        type: String,
        require: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('RefreshToken', RefreshToken);
// module.exports = dbConnection.model('User', UserSchema);


