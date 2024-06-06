const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../models/Users');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            const user = await Users.findOne({ where: { email, active: 1 } });

            if (!user)
                return done(null, false, {
                    message: 'Username does not exist',
                });

            const verifyPassword = user.validatePassword(password);

            if (!verifyPassword)
                return done(null, false, {
                    message: 'Wrong password',
                });

            return done(null, user);
        }
    )
);

passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (user, cb) {
    cb(null, user);
});

module.exports = passport;
