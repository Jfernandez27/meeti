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
        groupsController.uploadImage,
        groupsController.create
    );
    router.get(
        '/group/edit/:id',
        authController.authenticatedUser,
        groupsController.edit
    );
    router.post(
        '/group/edit/:id',
        authController.authenticatedUser,
        groupsController.update
    );
    router.get(
        '/group/image/:id',
        authController.authenticatedUser,
        groupsController.editImage
    );
    router.post(
        '/group/image/:id',
        authController.authenticatedUser,
        groupsController.uploadImage,
        groupsController.updateImage
    );
    router.get(
        '/group/delete/:id',
        authController.authenticatedUser,
        groupsController.delete
    );
    router.post(
        '/group/delete/:id',
        authController.authenticatedUser,
        groupsController.remove
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
