const Sequelize = require('sequelize');
const connection = require("../database/database.js");

const Category = connection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type:Sequelize.STRING,
        allowNull: false
    }
})

//sincronize batabase after modificate
//Category.sync({force:true})

module.exports = Category;
