const mongoose = require('mongoose')

const NewsletterSchema = new mongoose.Schema({
    email:{
        type: String
    },
})

const Newsletter = mongoose.model('Newsletter', NewsletterSchema);

module.exports = Newsletter;