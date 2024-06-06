const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const adminController = require('../controllers/adminController');
const usersController = require('../controllers/usersController');

module.exports = function () {
    router.get('/', homeController.home);

    // Sign in
    router.get('/signin', usersController.signin);
    router.post('/signin', usersController.addUser);
    router.get('/confirm/:email', usersController.confirm);

    // Login
    router.get('/login', authController.login);
    router.post('/login', authController.authenticateUser);

    //Admin Panel
    router.get('/admin', adminController.admin);

    //Profile
    router.get('/profile/edit', (req, res, next) => {
        res.send('Profile edit');
    });
    router.get('/profile/image', (req, res, next) => {
        res.send('Profile Image');
    });

    //Groups
    router.get('/group/new', (req, res, next) => {
        res.send('New Group');
    });

    //Meetis
    router.get('/meeti/new', (req, res, next) => {
        res.send('New Meeti');
    });

    return router;
};
