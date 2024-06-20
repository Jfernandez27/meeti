const Users = require('../../models/Users');
const Groups = require('../../models/Groups');

exports.show = async (req, res, next) => {
    const querys = [];
    querys.push(
        Users.findOne({
            where: { id: req.params.id },
        })
    );
    querys.push(
        Groups.findAll({
            where: { userId: req.params.id },
        })
    );

    const [user, groups] = await Promise.all(querys);

    if (!user) {
        res.redirect('/');
        return next();
    }

    res.render('frontend/profile', {
        headLine: `User Profile: ${user.name}`,
        user,
        groups,
    });
};
