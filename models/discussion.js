const mongoose = require('mongoose')
const Schema = mongoose.Schema

var discussionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    posted_date: {
        type: Date,
        required: true,
        default: Date.now
    },
    author: {
        type: String,
        required: true
    },
    comments: [
        {
            posted_date: {
                type: Date,
                required: true,
                default: Date.now
            },
            posted_by: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ]

})

module.exports = mongoose.model('Discussion', discussionSchema)