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

    // Leer los errores de express
    const errorsExpress = req.validationErrors();
    console.log(`errorsExpress: ${errorsExpress}`);

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
        console.log('Entra al catch');
        console.log(error);
        if (!transaction.finished) {
            await transaction.rollback();
        }
        // extraer el message de los errores
        const errorsSequelize = error.errors
            ? error.errors.map((err) => err.message)
            : [];

        // extraer unicamente el msg de los errores
        const errExp = errorsExpress ? errorsExpress.map((err) => err.msg) : [];

        //unirlos
        const errorsList = [...errorsSequelize, ...errExp];
        if (errorsList.length > 0) {
            req.flash('error', errorsList);
        }
        res.redirect('/signin');
    }
};
