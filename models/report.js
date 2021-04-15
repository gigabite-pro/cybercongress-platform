const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    name: {
        type: String,
        default : "Anonymous"
    },
    message: {
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