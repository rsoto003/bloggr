const express = require('express');
const router = express.Router();
const { ensureAuthenticated , ensureGuest }  = require('../helpers/auth');

//Posts Index
router.get('/', (req, res) => {
    res.render('stories/index')
});
//Add Post Form
router.get('/add', ensureAuthenticated,(req, res) => {
    res.render('posts/add');
})

module.exports = router;