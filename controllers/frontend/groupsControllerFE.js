const Groups = require('../../models/Groups');
const Meeti = require('../../models/Meeti');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.show = async (req, res, next) => {
    const querys = [];
    querys.push(
        Groups.findOne({
            where: { id: req.params.id },
        })
    );
    querys.push(
        Meeti.findAll({
            where: {
                groupId: req.params.id,
                date: { [Op.gte]: moment(new Date()).format('YYYY-MM-DD') },
            },
            order: [['date', 'ASC']],
        })
    );

    const [group, meetis] = await Promise.all(querys);

    if (!group) {
        res.redirect('/');
        return next();
    }

    res.render('frontend/group', {
        headLine: `Group Profile: ${group.name}`,
        group,
        meetis,
        moment,
    });
};
