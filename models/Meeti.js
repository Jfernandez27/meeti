const Sequelize = require('sequelize');
const db = require('../config/db');
const { v4: uuid } = require('uuid');
const slug = require('slug');
const shortId = require('shortid');
const { defaults } = require('pg');

const Users = require('./Users');
const Groups = require('./Groups');

const Meeti = db.define(
    'meeti',
    {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Add a title',
                },
            },
        },
        slug: {
            type: Sequelize.STRING,
        },
        guest: Sequelize.STRING,
        capacity: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Add a description',
                },
            },
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Add a date for the meeti',
                },
            },
        },
        time: {
            type: Sequelize.TIME,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Add a hour for the meeti',
                },
            },
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Add a address',
                },
            },
        },
        city: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Add a city',
                },
            },
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Add a state',
                },
            },
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Add a country',
                },
            },
        },
        location: {
            type: Sequelize.GEOMETRY('POINT'),
        },
        interested: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            defaultValue: [],
        },
    },
    {
        hooks: {
            async beforeCreate(meeti) {
                const url = slug(meeti.title).toLowerCase();
                meeti.slug = `${url}-${shortId.generate()}`;
            },
        },
    }
);

Meeti.belongsTo(Users);
Meeti.belongsTo(Groups);

module.exports = Meeti;
