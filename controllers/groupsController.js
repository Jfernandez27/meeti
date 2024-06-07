const Groups = require('../models/Groups');
const Categories = require('../models/Categories');
const { v4: uuid } = require('uuid');

exports.new = async (req, res, next) => {
    const categories = await Categories.findAll();
    res.render('groups/new', {
        headLine: 'New Group',
        categories,
    });
};

exports.create = async (req, res, next) => {
    //Sanitize
    req.sanitizeBody('name');
    req.sanitizeBody('url');

    const group = req.body;
    group.id = uuid();
    group.userId = req.user.id;

    group.categoryId = req.body.category;

    try {
        console.log(group);
        await Groups.create(group);
        req.flash('exito', 'The group has been created successfully');
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
        const errors = error.errors.map((err) => err.message);
        req.flash('error', errors);
        res.redirect('/group/new');
    }
};
