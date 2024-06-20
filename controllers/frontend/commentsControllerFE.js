const { where } = require('sequelize');
const Comments = require('../../models/Comments');
const Meeti = require('../../models/Meeti');

exports.addComment = async (req, res, next) => {
    const { comment } = req.body;

    await Comments.create({
        message: comment,
        userId: req.user.id,
        meetiId: req.params.id,
    });

    res.redirect('back');
    next();
};

exports.deleteComment = async (req, res, next) => {
    const { commentId } = req.body;

    const comment = await Comments.findOne({ where: { id: commentId } });

    if (!comment) {
        return res.status(404).send('Invalid Operation.');
    }

    const meeti = await Meeti.findOne({ where: { id: comment.meetiId } });
    if (comment.userId === req.user.id || meeti.userId === req.user.id) {
        await Comments.destroy({ where: { id: commentId } });
        res.status(200).send('Your comment has been deleted.');
        return next();
    } else {
        return res.status(403).send('Invalid Operation');
    }
};
