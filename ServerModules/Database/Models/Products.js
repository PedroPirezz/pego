const Sequelize = require('sequelize')
const connection = require('../Connection/DatabaseConection')
const Products = connection.define('products', {

    Name: {
        type: Sequelize.STRING,
        allownull: false
    },
    StoreID: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    Price: {
        type: Sequelize.DOUBLE,
        allownull: false
    },
    ImageUrl: {
        type: Sequelize.STRING,
        allownull: false
    },
    Available: {
        type: Sequelize.BOOLEAN,
        allownull: false
    },
})

Products.sync({ force: false }).then(() => {
    console.log("Products table connected with success")
})

module.exports = Products