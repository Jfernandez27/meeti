const Users = require('../models/Users');

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

    try {
        if (errorsExpress.length > 0) {
            throw new Error(e);
        }
        await Users.create(user);

        // // Url de confirmación
        // const url = `http://${req.headers.host}/confirm/${user.email}`;

        // // Enviar email de confirmación
        // await enviarEmail.enviarEmail({
        //     user,
        //     url,
        //     subject: 'Confirma tu cuenta de Meeti',
        //     archivo: 'confirmar-cuenta',
        // });

        //Flash Message y redireccionar
        // req.flash('exito', 'Hemos enviado un E-mail, confirma tu cuenta');
        res.redirect('/login');
    } catch (error) {
        // extraer el message de los errores
        const errorsSequelize = error.errors
            ? error.errors.map((err) => err.message)
            : [];

        // extraer unicamente el msg de los errores
        const errExp = errorsExpress ? errorsExpress.map((err) => err.msg) : [];

        //unirlos
        const errorsList = [...errorsSequelize, ...errExp];

        req.flash('error', errorsList);
        res.redirect('/signin');
    }
};
