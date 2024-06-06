exports.home = (req, res, next) => {
    res.render('home', {
        headLine: 'Home',
    });
};
