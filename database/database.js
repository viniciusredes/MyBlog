const Sequelize = require('sequelize');
const connection = new Sequelize('my_blog', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    timezone:'-03:00'
});

module.exports = connection;