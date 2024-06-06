const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const usersController = require('../controllers/usersController');

module.exports = function () {
    router.get('/', homeController.home);

    router.get('/signin', usersController.signin);

    router.get('/login', authController.login);

    return router;
};
