const Meeti = require('../../models/Meeti');
const Groups = require('../../models/Groups');
const Users = require('../../models/Users');
const moment = require('moment');
const Sequelize = require('sequelize');

exports.showMeeti = async (req, res) => {
    const meeti = await Meeti.findOne({
        where: { slug: req.params.slug },
        include: [
            { model: Groups },
            { model: Users, attributes: ['id', 'name', 'image'] },
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

    res.render('meeties/attendees', {
        headLine: 'Attendees List',
        attendees,
    });
};
