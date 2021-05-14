const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    reportType:{
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
    },
    typeOfUser:{
        type: String,
    },
    message: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
    },
    secrecy: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;