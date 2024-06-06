exports.login = (req, res, next) => {
    res.render('login', {
        headLine: 'Log in',
    });
};

exports.validateLogin = (req, res, next) => {
    // res.render('login', {
    //     headLine: 'Log in',
    // });
    res.send('Logeando...');
};
