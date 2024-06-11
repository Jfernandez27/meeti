require('dotenv').config({ path: '.env' });
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const router = require('./routes/routes');

const db = require('./config/db');

require('./models/Users');
require('./models/Categories');
require('./models/Groups');
require('./models/Meeti');

db.sync()
    .then(() => {
        console.log('DB Connected...');
    })
    .catch((error) => {
        console.log(`Error: ${error}`);
    });

const app = express();

//Enable reading data from forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable express Validator
app.use(expressValidator());

//Enable Cookie Parser
app.use(cookieParser());

//Session
app.use(
    session({
        secret: process.env.SECRET,
        key: process.env.KEY,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Template Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Views Folder
app.set('views', path.join(__dirname, './views'));

// Static Files
app.use(express.static('public'));

//Flash Messages
app.use(flash());

//Middlewares
app.use((req, res, next) => {
    res.locals.user = { ...req.user } || null;
    res.locals.messages = req.flash();
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});

//Routing
app.use('/', router());

app.listen(process.env.PORT, () => {
    console.log('Server Start');
});
