const Sequelize = require('sequelize')
const Connection = require('../Connection/DatabaseConection');

const Store = Connection.define('store', {

    StoreIdOwner: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    StoreName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    StoreDescription: {
        type: Sequelize.TEXT
    },
    StoreCategory: {
        type: Sequelize.STRING
    },
    StoreEmail: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    StoreNumberPhone: {
        type: Sequelize.STRING
    },
    StoreAddress: {
        type: Sequelize.STRING
    },
    StoreCity: {
        type: Sequelize.STRING
    },
    StoreState: {
        type: Sequelize.STRING
    },
    StoreCEP: {
        type: Sequelize.STRING
    },
    StoreAdressNumber: {
        type: Sequelize.STRING
    },
    StoreOpeningHours: {
        type: Sequelize.TEXT
    }

});

Store.sync({ force: false }).then(() => {
    console.log("Stores table connected with success")
})

module.exports = Store;