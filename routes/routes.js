const express = require('express');
const router = express.Router();

module.exports = function () {
    router.get('/', (req, res) => {
        res.render('home');
    });

    router.get('/register', (req, res, next) => {
        res.render('register');
    });

    router.get('/login', (req, res, next) => {
        res.send('Login');
    });

    return router;
};
