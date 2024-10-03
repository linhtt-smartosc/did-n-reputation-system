const {Schema, model} = require('mongoose');

const VCSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    issuer: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false,
    timestamps: true
})

const VC = model('vc', VCSchema);

module.exports = VC;