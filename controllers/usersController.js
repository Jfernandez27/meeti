const Users = require('../models/Users');
const db = require('../config/db');
const emails = require('../handlers/emails');

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
