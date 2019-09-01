const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

var StudentSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    name: String,
    email: String
});

StudentSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('Student', StudentSchema)