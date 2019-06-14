const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
      failureRedirect: '/login' 
    }), (req, res) =>  {
    res.redirect('/dashboard');
  });

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login'}), 
    (req, res) => {
    res.redirect('/');
    
    }
)

router.get('/verify', (req, res) => {
    if(req.user){
        console.log(req.user);
    } else {
        console.log('not auth')
    }
});
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});



module.exports = router;