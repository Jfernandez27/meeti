const Meeti = require('../../models/Meeti');
const Groups = require('../../models/Groups');
const Users = require('../../models/Users');
const moment = require('moment');

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
exports.rsvp = async (req, res) => {};
