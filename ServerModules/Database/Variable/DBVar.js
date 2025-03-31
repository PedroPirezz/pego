
const Users = require('../Models/Users');
const Stores = require('../Models/Stores');
const Products = require('../Models/Products');
const Order = require('../Models/Order');
const OrderItem = require('../Models/OrderItem');


const DB = {
    Users,
    Stores,
    Products,
    Order,
    OrderItem
};

module.exports = DB;

