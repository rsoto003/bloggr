const express = require('express');
const router = express.Router();

//index route
router.get('/', (req, res)=> {
    res.render('index/welcome');
});

router.get('/dashboard', (req, res)=> {
    res.send('dashboard');
})

module.exports = router;