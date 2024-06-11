const Users = require('../models/Users');
const db = require('../config/db');
const emails = require('../handlers/emails');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const multerConfig = {
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size at 5MB
    storage: (fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '/../public/uploads/profiles/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        },
    })),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('The file format is not valid'), false);
        }
    },
};

const upload = multer(multerConfig).single('image');

exports.uploadImage = async (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'File size exceeds allowed');
                } else {
                    req.flash('error', error.message);
                }
            } else if (error.hasOwnProperty('message')) {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            next();
        }
    });
};

exports.signin = (req, res) => {
    res.render('signin', {
        headLine: 'Create your account',
    });
};
exports.addUser = async (req, res) => {
    const user = req.body;

    req.checkBody('confirmPassword', 'Confirm Password is required').notEmpty();
    req.checkBody('confirmPassword', "Password didn't match").equals(
        req.body.password
    );

    // Read express Errors
    const errorsExpress = req.validationErrors();

    const transaction = await db.transaction();

    try {
        if (errorsExpress) {
            throw new Error('ValidationError');
        }

        await Users.create(user, { transaction });

        await transaction.commit();

        // confirm Url
        const url = `http://${req.headers.host}/confirm/${user.email}`;

        // Send email
        await emails.send({
            user,
            url,
            subject: 'Confirm your Meeti account',
            file: 'confirm',
        });

        // Flash Message
        req.flash(
            'exito',
            'We have sent you an email, please confirm your account'
        );
        res.redirect('/login');
    } catch (error) {
        if (!transaction.finished) {
            await transaction.rollback();
        }

        const errorsSequelize = error.errors
            ? error.errors.map((err) => err.message)
            : [];

        const errExp = errorsExpress ? errorsExpress.map((err) => err.msg) : [];

        const errorsList = [...errorsSequelize, ...errExp];
        if (errorsList.length > 0) {
            req.flash('error', errorsList);
        }
        res.redirect('/signin');
    }
};

exports.confirm = async (req, res, next) => {
    //Verify User Exist
    const user = await Users.findOne({
        where: {
            email: req.params.email,
        },
    });

    //Not User, Redirect
    if (!user) {
        req.flash('error', 'The user does not exist');
        res.redirect('/signin');
        return next();
    }

    //Confirm user, Redirect
    try {
        user.active = 1;
        await user.save();
        req.flash('exito', 'User confirmed, you can log in');
    } catch (error) {
        console.log(`Error activating user: ${error} `);
        req.flash('error', 'Error activating user');
    }
    res.redirect('/login');
    return next();
};

exports.edit = async (req, res, next) => {
    const user = await Users.findByPk(req.user.id);
    if (!user) {
        req.flash('error', 'Invalid Operation');
        res.redirect('/admin');
        return next();
    }
    res.render('profiles/edit', {
        headLine: 'Edit Profile',
        user,
    });
};

exports.update = async (req, res, next) => {
    const user = await Users.findByPk(req.user.id);
    if (!user) {
        req.flash('error', 'Invalid Operation');
        res.redirect('/admin');
        return next();
    }

    //Sanitize
    req.sanitizeBody('name');
    req.sanitizeBody('email');

    const { name, bio, email } = req.body;

    user.name = name;
    user.bio = bio;
    user.email = email;

    try {
        await user.save();
        req.flash('exito', 'The profile has been updated successfully');
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
        const errors = error.errors.map((err) => err.message);
        req.flash('error', errors);
        res.redirect('/profile/edit');
    }
};

exports.password = (req, res, next) => {
    res.render('auth/password', { headLine: 'Password change' });
};
exports.passwordUpdate = async (req, res, next) => {
    const user = await Users.findByPk(req.user.id);

    if (!user) {
        req.flash('error', 'Invalid Operation');
        res.redirect('/user/password');
        return next();
    }
    if (!user.validatePassword(req.body.current)) {
        req.flash('error', "Current password didn't match");
        res.redirect('/user/password');
        return next();
    }

    req.checkBody('confirm', 'Confirm Password is required').notEmpty();
    req.checkBody('confirm', "Password didn't match").equals(req.body.password);

    // Read express Errors
    const errorsExpress = req.validationErrors();

    if (errorsExpress) {
        console.log(errorsExpress);
        req.flash(
            'error',
            errorsExpress.map((error) => error.msg)
        );

        res.redirect('/user/password');
        return next();
    }

    const hash = user.passwordHash(req.body.password);

    user.password = hash;

    try {
        await user.save();
        req.logout(function (err) {});
        req.flash('exito', 'The password has been updated successfully');
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        const errors = error.errors.map((err) => err.message);
        req.flash('error', errors);
        res.redirect('/user/password');
    }
};
exports.profileImage = async (req, res, next) => {
    const user = await Users.findByPk(req.user.id);

    if (!user) {
        req.flash('error', 'Invalid Operation');
        res.redirect('/user/password');
        return next();
    }

    res.render('profiles/image', { headLine: 'Update Profile image', user });
};
exports.saveProfileImage = async (req, res, next) => {
    const user = await Users.findByPk(req.user.id);
    if (!user) {
        req.flash('error', 'Invalid Operation');
        res.redirect('/admin');
        return next();
    }

    if (req.file && user.image) {
        const previousImagePath =
            __dirname + `/../public/uploads/profiles/${user.image}`;

        fs.unlink(previousImagePath, (error) => {
            if (error) {
                console.log(error);
                if (error.hasOwnProperty('message')) {
                    req.flash('error', error.message);
                } else {
                    req.flash('error', 'Could not delete previous image');
                }
                res.redirect('/admin');
            }
            return;
        });
    }

    if (req.file) {
        user.image = req.file.filename;
    }

    try {
        await user.save();
        req.flash('exito', 'User image updated sucessfully');
    } catch (error) {
        console.log(error);
        if (error.hasOwnProperty('message')) {
            req.flash('error', error.message);
        } else {
            req.flash('error', 'Could not update Group image');
        }
    }
    res.redirect('/admin');
};
