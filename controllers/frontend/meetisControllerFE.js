const Meeti = require('../../models/Meeti');
const Groups = require('../../models/Groups');
const Users = require('../../models/Users');
const Categories = require('../../models/Categories');
const moment = require('moment');
const Sequelize = require('sequelize');

exports.show = async (req, res) => {
    const meeti = await Meeti.findOne({
        where: {
            slug: req.params.slug,
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

    if (!meeti) {
        req.flash('error', 'Invalid operation');
        res.redirect('/');
    }

    res.render('frontend/showMeeti', { headLine: meeti.title, meeti, moment });
};
exports.rsvp = async (req, res) => {
    const { act } = req.body;

    if (act === 'confirm') {
        Meeti.update(
            {
                interested: Sequelize.fn(
                    'array_append',
                    Sequelize.col('interested'),
                    req.user.id
                ),
            },
            { where: { slug: req.params.slug } }
        );
        res.send('You have confirmed your attendance');
    } else {
        Meeti.update(
            {
                interested: Sequelize.fn(
                    'array_remove',
                    Sequelize.col('interested'),
                    req.user.id
                ),
            },
            { where: { slug: req.params.slug } }
        );
        res.send('You have cancel your attendance');
    }
};

exports.showAttendees = async (req, res) => {
    const meeti = await Meeti.findOne({
        where: { slug: req.params.slug },
        attributes: ['interested'],
    });

    const { interested } = meeti;

    const attendees = await Users.findAll({
        attributes: ['name', 'image'],
        where: {
            id: interested,
        },
    });

    res.render('frontend/attendees', {
        headLine: 'Attendees List',
        attendees,
    });
};
exports.showCategory = async (req, res, next) => {
    const category = await Categories.findOne({
        attributes: ['id', 'name'],
        where: {
            slug: req.params.slug,
        },
    });

    if (!category) {
        res.redirect('/');
        return next();
    }
    const meetis = await Meeti.findAll({
        include: [
            {
                model: Groups,
                where: { categoryId: category.id },
            },
            {
                model: Users,
            },
        ],
    });

    res.render('category', {
        headLine: `Category: ${category.name}`,
        meetis,
        moment,
    });
};
