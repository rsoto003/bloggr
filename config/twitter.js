const TwitterStrategy = require('passport-twitter').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

module.exports = function(passport){
    passport.use(new TwitterStrategy({
        consumerKey: keys.consumerKey,
        consumerSecret: keys.consumerSecret,
        // callbackURL: "http://127.0.0.1:3000/auth/twitter/callback",
        callbackURL: "/auth/twitter/callback",
        proxy: true
    }, (token, tokenSecret, profile, cb) => {
            User.findOrCreate({ twitterId: profile.id}, (err, user) => {
                console.log(profile);
                console.log(tokenSecret);
                return cb( err, user);
            });
        }
    )); 
}
