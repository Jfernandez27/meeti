const Groups = require('../models/Groups');
const Categories = require('../models/Categories');

exports.new = async (req, res, next) => {
    const groups = await Groups.findAll({
        where: { userId: req.user.id },
    });
    res.render('meeties/new', {
        headLine: 'Create Meeti',
        groups,
    });
};

exports.add = async (req, res, next) => {
    res.send('agregando');
};
