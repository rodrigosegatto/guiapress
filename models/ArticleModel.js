const Sequelize = require('sequelize');
const conn = require('../database/database');
const Category = require('./CategoryModel');

const Article = conn.define('article',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    } 
});

// -> 1 Categoria, tem muitos Artigos
Category.hasMany(Article);
//-> 1 Artigo, sempre pertente a 1 categoria
Article.belongsTo(Category);

//Sync com BD
//Deixar comentado para que ele não tente criar as tabelas sempre que iniciado o app.
//Article.sync({force:true});

module.exports = Article;