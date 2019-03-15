const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');
//Load User Model
const User = mongoose.model('users');

module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: "http://127.0.0.1:3000/auth/twitter/callback",
            proxy: true
        },(accessToken, refreshToken, profile, done) => {
            // console.log(accessToken);
            // console.log(profile);

            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
            
            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: image
            }

            //Check for Existing User
            User.findOne({
                googleID: profile.id
            }).then(user => {
                if(user){
                    //User is found, Return User
                    done(null, user);
                } else {
                    //No User Found, Create New User
                    new User(newUser).save().then(user => {
                        done(null, user)
                    });
                }
            })
        })
    );

    passport.serializeUser((user, done)=> {
        //first parameter is for the error
        done(null, user.id);
    });
    passport.deserializeUser((id, done)=> {
        User.findById(id).then(user => done(null, user));
    });
}

