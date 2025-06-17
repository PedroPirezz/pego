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
    PaymentId: {
        type: Sequelize.STRING,
        allownull: false
    },
    PaymentMethod: {
        type: Sequelize.STRING, 
        allownull: false
    },
    PixKey: {
        type: Sequelize.STRING,
        allownull: false
    },
    PixQrCode: {
        type: Sequelize.TEXT,
        allownull: false
    },
})

Orders.sync({ force: false }).then(() => {
    console.log("Orders table connected with success")
})

module.exports = Orders