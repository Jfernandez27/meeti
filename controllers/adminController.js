const Groups = require('../models/Groups');

exports.admin = async (req, res, next) => {
    const groups = await Groups.findAll({
        where: {
            userId: req.user.id,
        },
    });
    res.render('admin', {
        headLine: 'Admin Panel',
        groups,
    });
};
