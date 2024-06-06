require('dotenv').config({ path: '.env' });
const db = require('./config/db');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const Sequelize = require('sequelize');
const path = require('path');
const router = require('./routes/routes');

require('./models/Users');
db.sync()
    .then(() => {
        console.log('DB Connected...');
    })
    .catch((error) => {
        console.log(`Error: ${error}`);
    });

const app = express();

// Template Engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Views Folder
app.set('views', path.join(__dirname, './views'));

// Static Files
app.use(express.static('public'));

//Middlewares
app.use((req, res, next) => {
    const date = new Date();
    res.locals.year = date.getFullYear();
    next();
});

//Routing
app.use('/', router());

app.listen(process.env.PORT, () => {
    console.log('Server Start');
});
