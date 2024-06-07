const Groups = require('../models/Groups');
const Meeti = require('../models/Meeti');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.admin = async (req, res, next) => {
    const querys = [];
    querys.push(
        Groups.findAll({
            where: {
                userId: req.user.id,
            },
        })
    );
    querys.push(
        Meeti.findAll({
            where: {
                userId: req.user.id,
                date: { [Op.gte]: moment(new Date()).format('YYYY-MM-DD') },
            },
        })
    );
    querys.push(
        Meeti.findAll({
            where: {
                userId: req.user.id,
                date: { [Op.lt]: moment(new Date()).format('YYYY-MM-DD') },
            },
        })
    );
    const [groups, meeties, pastMeeties] = await Promise.all(querys);
    res.render('admin', {
        headLine: 'Admin Panel',
        groups,
        meeties,
        moment,
        pastMeeties,
    });
};
