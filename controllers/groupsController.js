const Groups = require('../models/Groups');
const Categories = require('../models/Categories');
const { v4: uuid } = require('uuid');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const multerConfig = {
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size at 5MB
    storage: (fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '/../public/uploads/groups/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        },
    })),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('The file format is not valid'), false);
        }
    },
};

const upload = multer(multerConfig).single('image');

exports.uploadImage = async (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            if (error instanceof multer.MulterError) {
                if (error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'File size exceeds allowed');
                } else {
                    req.flash('error', error.message);
                }
            } else if (error.hasOwnProperty('message')) {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            next();
        }
    });
};

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

    //read image
    if (req.file) {
        group.image = req.file.filename;
    }

    try {
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

exports.edit = async (req, res, next) => {
    const querys = [];
    querys.push(Groups.findByPk(req.params.id));
    querys.push(Categories.findAll());

    const [group, categories] = await Promise.all(querys);

    res.render('groups/edit', {
        headLine: `Edit Group: ${group.name}`,
        group,
        categories,
    });
};

exports.update = async (req, res, next) => {
    const group = await Groups.findOne({
        where: { id: req.params.id, userId: req.user.id },
    });

    if (!group) {
        req.flash('error', 'Invalid operation');
        res.redirect('/admin');
        return next();
    }

    const { name, description, category: categoryId, url } = req.body;

    group.name = name;
    group.description = description;
    group.categoryId = categoryId;
    group.url = url;
    try {
        await group.save();
        req.flash('exito', 'Group updated sucessfully');
    } catch (error) {
        console.log(error);
        if (error.hasOwnProperty('message')) {
            req.flash('error', error.message);
        }
    }
    res.redirect('/admin');
};

exports.editImage = async (req, res, next) => {
    const group = await Groups.findOne({
        where: { id: req.params.id, userId: req.user.id },
    });

    if (!group) {
        req.flash('error', 'Invalid operation');
        res.redirect('/admin');
        return next();
    }

    res.render('groups/image', {
        headLine: `Edit Image Group: ${group.name}`,
        group,
    });
};

exports.updateImage = async (req, res, next) => {
    const group = await Groups.findOne({
        where: { id: req.params.id, userId: req.user.id },
    });

    if (!group) {
        req.flash('error', 'Invalid operation');
        res.redirect('/admin');
        return next();
    }

    // if (req.file) {
    //     console.log(req.file.filename);
    // }

    // if (group.image) {
    //     console.log(group.image);
    // }

    if (req.file && group.image) {
        const previousImagePath =
            __dirname + `/../public/uploads/groups/${group.image}`;

        fs.unlink(previousImagePath, (error) => {
            if (error) {
                console.log(error);
                if (error.hasOwnProperty('message')) {
                    req.flash('error', error.message);
                } else {
                    req.flash('error', 'Could not delete previous image');
                }
                res.redirect('/admin');
            }
            return;
        });
    }

    if (req.file) {
        group.image = req.file.filename;
    }

    try {
        await group.save();
        req.flash('exito', 'Group image updated sucessfully');
    } catch (error) {
        console.log(error);
        if (error.hasOwnProperty('message')) {
            req.flash('error', error.message);
        } else {
            req.flash('error', 'Could not update Group image');
        }
    }
    res.redirect('/admin');
};

exports.delete = async (req, res, next) => {
    const group = await Groups.findOne({
        where: { id: req.params.id, userId: req.user.id },
    });

    if (!group) {
        req.flash('error', 'Invalid operation');
        res.redirect('/admin');
        return next();
    }
    res.render('groups/delete', {
        headLine: `Delete Group: ${group.name}`,
    });
};
exports.remove = async (req, res, next) => {
    const group = await Groups.findOne({
        where: { id: req.params.id, userId: req.user.id },
    });

    if (!group) {
        req.flash('error', 'Invalid operation');
        res.redirect('/admin');
        return next();
    }
    if (group.image) {
        const imagePath =
            __dirname + `/../public/uploads/groups/${group.image}`;

        fs.unlink(imagePath, (error) => {
            if (error) {
                console.log(error);
                if (error.hasOwnProperty('message')) {
                    req.flash('error', error.message);
                } else {
                    req.flash('error', 'Could not delete image group');
                }
                res.redirect('/admin');
            }
            return;
        });
    }

    await Groups.destroy({
        where: {
            id: req.params.id,
        },
    });

    req.flash('exito', 'Group deleted sucessfully');
    res.redirect('/admin');
};
