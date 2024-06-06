const express = require('express');
const path = require('path');
const router = require('./routes/routes');

require('dotenv').config({ path: '.env' });

const app = express();

// Template Engine
app.set('view engine', 'ejs');

// Views Folder
app.set('views', path.join(__dirname, './views'));

// Static Files
app.use(express.static('public'));

//Routing
app.use('/', router());

app.listen(process.env.PORT, () => {
    console.log('Server Start');
});
