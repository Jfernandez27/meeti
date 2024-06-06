const express = require('express');
require('dotenv').config({ path: '.env' });

const app = express();

app.listen(process.env.PORT, () => {
    console.log('Server Start');
});
