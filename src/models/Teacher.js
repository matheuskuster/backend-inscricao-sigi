const mongoose = require('mongoose');

const Teacher = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    rg: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cellphone: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Teacher', Teacher);