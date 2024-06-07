const Sequelize = require('sequelize');
const db = require('../config/db');
const { v4: uuid } = require('uuid');
const Categories = require('./Categories');
const Users = require('./Users');

const Groups = db.define('groups', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: uuid(),
    },
    name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'The group must have a name' },
        },
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Add a description' },
        },
    },
    url: Sequelize.TEXT,
    image: Sequelize.TEXT,
});

Groups.belongsTo(Categories);
Groups.belongsTo(Users);

module.exports = Groups;
