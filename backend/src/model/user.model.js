const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'issuer']
    },
    _id: {
        type: String,
        required: true
    },
    encryptedKey: {
        type: String
    },
    reputation: {
        type: Number,
        default: 0,
    },
    did: {
        type: String,
        ref: 'did'
    },
    smartAccount: {
        type: String,
    },
    name: {
        type: String,
    }
}, {
    versionKey: false,
    timestamps: true
});


const User = model('user', userSchema);

module.exports = User;