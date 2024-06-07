const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const adminController = require('../controllers/adminController');
const usersController = require('../controllers/usersController');
const groupsController = require('../controllers/groupsController');

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
    router.get(
        '/admin',
        authController.authenticatedUser,
        adminController.admin
    );

    //Groups
    router.get(
        '/group/new',
        authController.authenticatedUser,
        groupsController.new
    );
    router.post(
        '/group/new',
        authController.authenticatedUser,
        groupsController.create
    );

    //Profile
    router.get('/profile/edit', (req, res, next) => {
        res.send('Profile edit');
    });
    router.get('/profile/image', (req, res, next) => {
        res.send('Profile Image');
    });

    //Meetis
    router.get('/meeti/new', (req, res, next) => {
        res.send('New Meeti');
    });

    return router;
};
