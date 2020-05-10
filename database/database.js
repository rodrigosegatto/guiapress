const Sequelize = require('sequelize');
const config = require('../config/config');

//Conectando no Banco de Dados
const conn = new Sequelize(
    config.mysql_prod.db, config.mysql_prod.user, config.mysql_prod.password,{
        host: config.mysql_prod.host,
        dialect: config.mysql_prod.client,
        logging: false,
        timezone: "-03:00" //BRasil
    }
);

module.exports = conn;
