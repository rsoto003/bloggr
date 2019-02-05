const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = process.env.PORT || 5000;

//index route
app.get('/', (req, res)=> {
    res.send('this is the index page.');
})


app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});