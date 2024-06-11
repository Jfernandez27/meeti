const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const adminController = require('../controllers/adminController');
const usersController = require('../controllers/usersController');
const groupsController = require('../controllers/groupsController');
const meetisController = require('../controllers/meetisController');

module.exports = function () {
    router.get('/', homeController.home);

    // Sign in
    router.get('/signin', usersController.signin);
    router.post('/signin', usersController.addUser);
    router.get('/confirm/:email', usersController.confirm);

    // Login
    router.get('/login', authController.login);
    router.post('/login', authController.authenticateUser);

    // Login
    router.get(
        '/logout',
        authController.authenticateUser,
        authController.logout
    );

    /*PRIVATE AREA */

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

    //Meetis
    router.get(
        '/meeti/new',
        authController.authenticatedUser,
        meetisController.new
    );
    router.post(
        '/meeti/new',
        authController.authenticatedUser,
        meetisController.sanitizeMeeti,
        meetisController.add
    );
    router.get(
        '/meeti/edit/:id',
        authController.authenticatedUser,
        meetisController.edit
    );
    router.post(
        '/meeti/edit/:id',
        authController.authenticatedUser,
        meetisController.sanitizeMeeti,
        meetisController.update
    );
    router.get(
        '/meeti/delete/:id',
        authController.authenticatedUser,
        meetisController.delete
    );
    router.post(
        '/meeti/delete/:id',
        authController.authenticatedUser,
        meetisController.remove
    );

    //Profile
    router.get(
        '/profile/edit',
        authController.authenticatedUser,
        usersController.edit
    );
    router.post(
        '/profile/edit',
        authController.authenticatedUser,
        usersController.update
    );
    router.get(
        '/user/password',
        authController.authenticatedUser,
        usersController.password
    );
    router.post(
        '/user/password',
        authController.authenticatedUser,
        usersController.passwordUpdate
    );
    router.get(
        '/profile/image',
        authController.authenticatedUser,
        usersController.profileImage
    );
    router.post(
        '/profile/image',
        authController.authenticatedUser,
        usersController.uploadImage,
        usersController.saveProfileImage
    );

    return router;
};
