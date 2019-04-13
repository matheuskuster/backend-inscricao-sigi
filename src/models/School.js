const mongoose = require('mongoose');

const School = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        required: true
    },
    students: {
        type: Number,
        required: true
    },
    paths: [ {type: String} ],
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
}, {
    timestamps: true
});

module.exports = mongoose.model('School', School);