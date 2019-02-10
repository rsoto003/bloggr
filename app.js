const express = require('express');
const exphhbs = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//Load User Model
require('./models/User');
//Passport Config
require('./config/passport')(passport);

//Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const posts = require('./routes/posts');

//Load Keys
const keys = require('./config/keys');

//Get Rid of Promise Error: Map Global Promises
mongoose.Promise = global.Promise;

//Mongoose Connect
mongoose.connect(keys.mongoURI, {
    // useMongoClient: true,
    useNewUrlParser: true
}).then(() => {
    console.log('mongoDB connected');
}).catch(err => console.log(err));


const app = express();

//Handlebars Middleware
app.engine('handlebars', exphhbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



// app.use(cookieParser);
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')))

//Use Routes
app.use('/auth', auth);
app.use('/', index);
app.use('/posts', posts)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});