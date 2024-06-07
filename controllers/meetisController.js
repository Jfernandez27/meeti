const Meeti = require('../models/Meeti');
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
    const meeti = req.body;

    meeti.userId = req.user.id;

    const lat = parseFloat(req.body.lat);
    const lng = parseFloat(req.body.lng);

    if (isNaN(lat) || isNaN(lng)) {
        req.flash('error', 'Invalid coordinates provided');
        res.redirect('/meeti/new');
        return; // Termina la ejecución para evitar errores posteriores
    }

    const point = {
        type: 'Point',
        coordinates: [lat, lng],
    };

    meeti.location = point;

    if (req.body.capacity === '') {
        meeti.capacity = 0;
    }

    try {
        const createdMeeti = await Meeti.create(meeti);
        req.flash('exito', 'The meeti has been created successfully');
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
        const errors = error.errors.map((err) => err.message);
        req.flash('error', errors);
        res.redirect('/meeti/new');
    }
};

exports.sanitizeMeeti = (req, res, next) => {
    req.sanitizeBody('title');
    req.sanitizeBody('guest');
    req.sanitizeBody('capacity');
    req.sanitizeBody('date');
    req.sanitizeBody('time');
    req.sanitizeBody('address');
    req.sanitizeBody('city');
    req.sanitizeBody('state');
    req.sanitizeBody('country');
    req.sanitizeBody('lat');
    req.sanitizeBody('lng');
    req.sanitizeBody('groupId');

    next();
};

exports.edit = (req, res, next) => {};
exports.update = (req, res, next) => {};
