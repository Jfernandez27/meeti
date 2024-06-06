const passport = require('passport');

exports.login = (req, res, next) => {
    res.render('login', {
        headLine: 'Log in',
    });
};

exports.authenticateUser = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
});
