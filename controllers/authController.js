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

exports.authenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/login');
};

exports.logout = (req, res, next) => {
    req.logout(function (err) {});
    res.redirect('/login');
    next();
};
