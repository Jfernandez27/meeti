const Meeti = require('../../models/Meeti');
const Groups = require('../../models/Groups');
const Users = require('../../models/Users');

const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.search = async (req, res, next) => {
    const { category, title, city, country } = req.query;

    let meetis;
    if (category === '') {
        meetis = await Meeti.findAll({
            where: {
                title: { [Op.iLike]: '%' + title + '%' },
                city: { [Op.iLike]: '%' + city + '%' },
                country: { [Op.iLike]: '%' + country + '%' },
            },
            include: [
                {
                    model: Groups,
                },
                {
                    model: Users,
                    attributes: ['id', 'name', 'image'],
                },
            ],
        });
    } else {
        meetis = await Meeti.findAll({
            where: {
                title: { [Op.iLike]: '%' + title + '%' },
                city: { [Op.iLike]: '%' + city + '%' },
                country: { [Op.iLike]: '%' + country + '%' },
            },
            include: [
                {
                    model: Groups,
                    where: { categoryId: { [Op.eq]: category } },
                },
                {
                    model: Users,
                    attributes: ['id', 'name', 'image'],
                },
            ],
        });
    }

    res.render('search', {
        headLine: 'Search results',
        meetis,
        moment,
    });
};
