const Meeti = require('../../models/Meeti');
const Groups = require('../../models/Groups');
const Users = require('../../models/Users');
const Categories = require('../../models/Categories');
const Comments = require('../../models/Comments');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.show = async (req, res) => {
    const meeti = await Meeti.findOne({
        where: {
            slug: req.params.slug,
        },
        include: [
            { model: Groups },
            { model: Users, attributes: ['id', 'name', 'image'] },
        ],
    });

    if (!meeti) {
        req.flash('error', 'Invalid operation');
        res.redirect('/');
    }

    const location = Sequelize.literal(
        `ST_GeomFromText('POINT(${meeti.location.coordinates[0]} ${meeti.location.coordinates[1]})')`
    );

    const distance = Sequelize.fn(
        'ST_DistanceSphere',
        Sequelize.col('location'),
        location
    );

    const nearbys = await Meeti.findAll({
        order: distance,
        where: Sequelize.where(distance, {
            [Op.lte]: 2000,
        }),
        limit: 3,
        offset: 1,
        include: [
            { model: Groups },
            { model: Users, attributes: ['id', 'name', 'image'] },
        ],
    });

    const comments = await Comments.findAll({
        where: { meetiId: meeti.id },
        include: [{ model: Users, attributes: ['id', 'name', 'image'] }],
    });

    res.render('frontend/showMeeti', {
        headLine: meeti.title,
        meeti,
        comments,
        nearbys,
        moment,
    });
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
