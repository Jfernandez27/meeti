const Meeti = require('../models/Meeti');
const Groups = require('../models/Groups');
const Categories = require('../models/Categories');
const { v4: uuid } = require('uuid');

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

    meeti.id = uuid();

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

exports.edit = async (req, res, next) => {
    const querys = [];
    querys.push(
        Groups.findAll({
            where: {
                userId: req.user.id,
            },
        })
    );
    querys.push(Meeti.findByPk(req.params.id));

    const [groups, meeti] = await Promise.all(querys);

    if (!groups || !meeti) {
        req.flash('error', 'Invalid operation');
        res.redirect('/admin');
        return next();
    }
    res.render('meeties/edit', {
        headLine: `Edit Meeti: ${meeti.title}`,
        groups,
        meeti,
    });
};
exports.update = async (req, res, next) => {
    const meeti = await Meeti.findOne({
        where: { id: req.params.id, userId: req.user.id },
    });

    if (!meeti) {
        req.flash('error', 'Invalid operation');
        res.redirect('/admin');
        return next();
    }

    const {
        groupId,
        title,
        guest,
        date,
        time,
        capacity,
        description,
        address,
        city,
        state,
        country,
        lat,
        lng,
    } = req.body;

    const point = {
        type: 'Point',
        coordinates: [parseFloat(lat), parseFloat(lng)],
    };

    meeti.groupId = groupId;
    meeti.title = title;
    meeti.guest = guest;
    meeti.date = date;
    meeti.time = time;
    meeti.capacity = capacity;
    meeti.description = description;
    meeti.address = address;
    meeti.city = city;
    meeti.state = state;
    meeti.country = country;
    meeti.location = point;

    try {
        await meeti.save();
        req.flash('exito', 'The meeti has been updated successfully');
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
        const errors = error.errors.map((err) => err.message);
        req.flash('error', errors);
        res.redirect('/meeti/edit');
    }
};
exports.delete = async (req, res, next) => {
    const meeti = await Meeti.findOne({
        where: { id: req.params.id, userId: req.user.id },
    });

    if (!meeti) {
        req.flash('error', 'Invalid operation');
        res.redirect('/admin');
        return next();
    }
    res.render('meeties/delete', {
        headLine: `Delete Meeti: ${meeti.title}`,
    });
};
exports.remove = async (req, res, next) => {
    const meeti = await Meeti.findOne({
        where: { id: req.params.id, userId: req.user.id },
    });

    if (!meeti) {
        req.flash('error', 'Invalid operation');
        res.redirect('/admin');
        return next();
    }

    await Meeti.destroy({
        where: {
            id: req.params.id,
        },
    });

    req.flash('exito', 'Meeti deleted sucessfully');
    res.redirect('/admin');
};
