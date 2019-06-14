const express = require('express');
const exphhbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');


require('./models/User');
require('./models/Post');
require('./config/passport')(passport);
require('./config/twitter')(passport);



const auth = require('./routes/auth');
const index = require('./routes/index');
const posts = require('./routes/posts');


const keys = require('./config/keys');


const {
    truncate, 
    stripTags,
    formatDate,
    select, 
    editIcon
} = require('./helpers/hbs');

s
mongoose.Promise = global.Promise;


mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
}).then( () => {
    console.log('mongoDB connected');
}).catch( err => console.log(err));


const app = express();

//Middleware
app.use( bodyParser.urlencoded({ extended: false} ));
app.use( bodyParser.json() );


app.use( methodOverride('_method') );

app.engine('handlebars', exphhbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth', auth);
app.use('/', index);
app.use('/posts', posts)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});

