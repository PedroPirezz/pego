const Sequelize = require('sequelize')
const connection = require('../Connection/DatabaseConection')
const OrderItem = connection.define('orderitem', {

    
    OrderId: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    ProductId: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    ProductName : {
        type: Sequelize.STRING,
        allownull: false
    },
    Quantity: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    UnitPrice: { 
        type: Sequelize.DOUBLE,
        allownull: false
    },
    SubTotal: {
        type: Sequelize.DOUBLE,
        allownull: false
    },
})

OrderItem.sync({ force: false }).then(() => {
    console.log("OrderItem table connected with success")
})

module.exports = OrderItem