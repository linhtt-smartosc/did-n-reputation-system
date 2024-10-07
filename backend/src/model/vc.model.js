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
    },
    iat: {
        type: String,
        required: true
    },
    exp: {
        type: String,
        required: true
    },
    proof: {
        type: Object,
        required: true
    },
    type: {
        type: [],
        required: true
    }
}, {
    versionKey: false,
    timestamps: true
})

const VC = model('vc', VCSchema);

module.exports = VC;