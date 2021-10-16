const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const dbConnection = require('../configs/db/connections_mongdb');

const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 100,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'GUEST'
    },
    avatarId: {
        type: String,
        default: ''
    },
    avatarViewLink:{
        type: String,
        default: ''
    },
    website:{
        type: String,
        default: ''
    }
},{
    timestamps: true
});

// hash password
UserSchema.pre('save', async function (next) {

    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;
        next();
    } catch (error) {        
        next(error);
    }
})

UserSchema.methods.checkPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
    }
}

module.exports = mongoose.model('User', UserSchema);
// module.exports = dbConnection.model('User', UserSchema);


