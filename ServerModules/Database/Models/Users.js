const Sequelize = require('sequelize')
const connection = require('../Connection/DatabaseConection')
const Users = connection.define('users', {

    Name: {
        type: Sequelize.STRING,
        allownull: false
    },
    CPF_CNPJ: {
        type: Sequelize.STRING, 
        allownull: false
    },
    AccountType: {
        type: Sequelize.STRING,
        allownull: false  
    },
    Email: {
        type: Sequelize.STRING, 
        allownull: false 
    },
    Password: {
        type: Sequelize.STRING, 
        allownull: false
    },
    Token: {
        type: Sequelize.STRING,
        allownull: false
    },
    NumberPhone: { 
        type: Sequelize.STRING,
        allownull: false
    },
})

Users.sync({ force: false }).then(() => {
    console.log("Users table connected with success")
})

module.exports = Users