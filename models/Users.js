const Sequelize = require('sequelize').DataTypes;
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Users = db.define(
    'users',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: Sequelize.STRING(100),
        image: Sequelize.STRING(100),
        email: {
            type: Sequelize.INTEGER(100),
            allowNull: false,
            validate: { isEmail: { msg: 'Add a valid email' } },
            unique: { args: true, msg: 'Email already registered' },
        },
        password: {
            type: Sequelize.STRING(60),
            allowNull: false,
            validate: { notEmpty: { msg: 'Password is required' } },
        },
        active: { type: Sequelize.INTEGER(1), defaultValue: 0 },
        token: Sequelize.STRING,
        tokenExpire: Sequelize.DATE,
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
