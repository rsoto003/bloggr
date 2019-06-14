const express = require('express');
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const User = mongoose.model('users');
const router = express.Router();
const { ensureAuthenticated , ensureGuest }  = require('../helpers/auth');


router.get('/', (req, res) => {
    Post.find({status: 'public'})
        .populate('user')
        .sort({date: 'desc'})
        .then(posts => {
        res.render('posts/index', {
            posts: posts
        });
    })
});

router.get('/show/:id', (req, res) => {
    Post.findOne({
        _id: req.params.id
    }).populate('user')
    .populate('comments.commentUser')
    .then(post => {
        if(post.status == 'public'){
            res.render('posts/show', {
                post: post
            });
        } else {
            if(req.user){
                if(req.user.id == post.user._id){
                    res.render('posts/show', {
                        post: post
                    });
                } else {
                    res.redirect('/posts');
                }
            } else {
                res.redirect('/posts');
            }
        }
    })
});

router.get('/user/:userId', (req, res) => {
    Post.find({
        user: req.params.userId,
        status: 'public'
    })
    .populate('user')
    .then(posts => {
        res.render('posts/index', {
            posts: posts
        });
    });
});


router.get('/my', ensureAuthenticated, (req, res) => {
    Post.find({
        user: req.user.id,
    })
    .populate('user')
    .then(posts => {
        res.render('posts/index', {
            posts: posts
        });
    });
});

router.get('/add', ensureAuthenticated,(req, res) => {
    res.render('posts/add');
});


router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Post.findOne({
        _id: req.params.id
    }).then(post => {
        if(post.user != req.user.id){
            res.redirect('/posts');
        } else {
            res.render('posts/edit', {
                post: post
            });    
        }
    });
    
})

router.post('/',  (req, res) => {
    let allowComments;

    if(req.body.allowComments){
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newPost = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    new Post(newPost)
        .save()
        .then(post => {
            res.redirect(`/posts/show/${post.id}`);
        });

});

router.put('/:id', (req,res) => {
    Post.findOne({ 
        _id: req.params.id
    }).then(post => {
        let allowComments;

        if(req.body.allowComments){
            allowComments = true;
        } else {
            allowComments = false;
        }

        //New Values
        post.title = req.body.title;
        post.body = req.body.body;
        post.status = req.body.status;
        post.allowComments = allowComments;
        
        post.save().then(post => {
            res.redirect('/dashboard');
        });
    });
});

router.delete('/:id', (req, res) => {
    Post.deleteOne({_id: req.params.id})
       .then(()=> {
           res.redirect('/dashboard');
       });
       console.log('story deleted.')
});

router.post('/comment/:id', (req, res) =>{
    Post.findOne({_id: req.params.id})
        .then(post => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }
            post.comments.unshift(newComment);

            post.save()
                .then(post => {
                    res.redirect(`/posts/show/${post.id}`);
                });
        });
});


module.exports = router;