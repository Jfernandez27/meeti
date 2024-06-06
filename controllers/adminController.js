exports.admin = (req, res, next) => {
    res.render('admin', {
        headLine: 'Admin Panel',
    });
};
