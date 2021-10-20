const Sequelize = require('sequelize');
const connection = require("../database/database");
const Category = require("../categories/Category")

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type:Sequelize.STRING,
        allowNull: false
    },body: {
        type: Sequelize.TEXT,
        allowNull:false
    }
})
//Create Relationship
// 1 para muitos
Category.hasMany(Article);
// 1 para 1
Article.belongsTo(Category);

//sincronize batabase after modificate
//Article.sync({force:true});

//Export Module
module.exports = Article;