const TwitterStrategy = require('passport-twitter').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(new TwitterStrategy({
        consumerKey: keys.consumerKey,
        consumerSecret: keys.consumerSecret,
        callbackURL: "/auth/twitter/callback",
        proxy: true
    }, (token, tokenSecret, profile, cb) => {
            console.log('token: ' + token);
            const image = profile._json.profile_image_url;
            const newUser = {
                twitterID: profile.id,
                userName: profile._json.screen_name,
                firstName: profile._json.name,
                email: profile._json.name + '_twitter@test.com',
                image: image
            }
            User.findOne({
                twitterID: profile.id
            }).then( user => {
                if(user){
                    done(null, user);
                } else {
                    new User(newUser).save().then( user => {
                            done(null, user);
                        });
                }
            });
        }
    )); 

    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });
    passport.deserializeUser((id, done)=> {
        User.findById(id).then(user => done(null, user));
    });
}




            // User.findOrCreate({ twitterId: profile.id}, (err, user) => {
            //     console.log('profile: ' + profile.id);
            //     console.log('tokenSecret: ' + tokenSecret);
            //     return cb( err, user);
            // });