const { Schema, model } = require('mongoose');

const requestedVCSchema = new Schema({
    _id: {
        type: String,
        ref: 'vc',
        required: true
    },
    holder: {
        type: String,
        ref: 'user',
        required: true
    },
    verifier: {
        type: String,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        enum: ['presented', 'requested', 'valid', 'invalid'],
        default: 'presented'
    },
    
}, {
    versionKey: false,
    timestamps: true
})

const RequestedVC = model('requestedVC', requestedVCSchema);

module.exports = RequestedVC;