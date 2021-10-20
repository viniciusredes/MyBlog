const Sequelize = require('sequelize');
const connection = require("../database/database.js");

const User = connection.define('users', {
    name: {
        type:Sequelize.STRING,
        allowNull:false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type:Sequelize.STRING,
        allowNull: false
    }
})

//sincronize batabase after modificate
//Category.sync({force:true})

module.exports = User;
