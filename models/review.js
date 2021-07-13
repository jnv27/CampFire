const mongoose = require('mongoose');
const User = require('./user');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating:{
        type: Number,
        min: 1
    }
});

module.exports = mongoose.model('Review',reviewSchema);