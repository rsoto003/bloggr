const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TwitterSchema = new Schema({
    twitterID: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
    }
});