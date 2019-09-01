const mongoose = require('mongoose')
const Schema = mongoose.Schema

var playgroundSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type:String,
        required: true
    },
    language: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Playground', playgroundSchema)