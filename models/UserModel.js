const Sequelize = require('sequelize');
const conn = require('../database/database');

const User = conn.define('user',{
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

//User.sync({force:true});

module.exports = User;