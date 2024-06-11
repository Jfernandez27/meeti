const Categories = require('../models/Categories');
const Groups = require('../models/Groups');
const Users = require('../models/Users');
const Meeti = require('../models/Meeti');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.home = async (req, res, next) => {
    const querys = [];
    querys.push(Categories.findAll());
    querys.push(
        Meeti.findAll({
            attributes: ['title', 'slug', 'date', 'time'],
            where: {
                date: { [Op.gte]: moment(new Date()).format('YYYY-MM-DD') },
            },
            order: [['date', 'ASC']],
            limit: 3,
            include: [
                { model: Groups, attributes: ['image'] },
                { model: Users, attributes: ['name', 'image'] },
            ],
        })
    );
    const [categories, meetis] = await Promise.all(querys);
    res.render('home', {
        headLine: 'Home',
        categories,
        meetis,
        moment,
    });
};
