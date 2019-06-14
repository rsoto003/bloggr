const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TwitterSchema = new Schema({
    twitterID: {
        type: String, 
        // required: true
    },
    userName: {
        type: String,
        // required: true,
    },
    firstName: {
        type: String
    },
    image: {
        type: String
    },
    email: {
        type: String,
        required: true
    }
});

mongoose.model('users', TwitterSchema);