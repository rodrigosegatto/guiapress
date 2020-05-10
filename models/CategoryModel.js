const Sequelize = require('sequelize');
const conn = require('../database/database');

const Category = conn.define('category',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    } 
});

//Sync com BD
//Deixar comentado para que ele não tente criar as tabelas sempre que iniciado o app.
//Category.sync({force:true});

module.exports = Category;