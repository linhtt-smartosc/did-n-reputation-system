const { Schema, model } = require('mongoose');

const didSchema = new Schema({
    _id: 
    {
        type: String,
        required: true
    },
    owner: {
        type: String,
        ref: 'user',
        required: true
    },
    chainId: {
        type: Number,
        required: true
    }
}, {
    versionKey: false,
})

const DID = model('did', didSchema);

module.exports = DID;