const Sequelize = require('sequelize')
const connection = require('../Connection/DatabaseConection')
const Orders = connection.define('orders', {

    StoreID: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    UserId: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    TotalPrice: {
        type: Sequelize.DOUBLE,
        allownull: false
    },
    Status: {
        type: Sequelize.STRING,
        allownull: false 
    },
    PaymentMethod: {
        type: Sequelize.STRING,
        allownull: false
    },
    PaymentLink: {
        type: Sequelize.STRING,
        allownull: false
    },
})

Orders.sync({ force: false }).then(() => {
    console.log("Orders table connected with success")
})

module.exports = Orders