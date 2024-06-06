const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Users = db.define(
    'users',
    {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: Sequelize.DataTypes.STRING(100),
        image: Sequelize.DataTypes.STRING(100),
        email: {
            type: Sequelize.DataTypes.STRING(100),
            allowNull: false,
            validate: {
                isEmail: { msg: 'Add a valid email' },
            },
            unique: {
                args: true,
                msg: 'Email already registered',
            },
        },
        password: {
            type: Sequelize.DataTypes.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Password is required' },
            },
        },
        active: {
            type: Sequelize.DataTypes.INTEGER(),
            defaultValue: 0,
        },
        token: Sequelize.DataTypes.STRING,
        tokenExpire: Sequelize.DataTypes.DATE,
    },
    {
        hooks: {
            beforeCreate(user) {
                user.password = bcrypt.hashSync(
                    user.password,
                    bcrypt.genSaltSync(10),
                    null
                );
            },
        },
    }
);

// Compare passwords method
Users.prototype.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = Users;
