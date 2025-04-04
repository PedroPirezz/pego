const DB = require("../../../Database/Variable/DBVar");
const express = require("express");
const router = express.Router();

module.exports = (req, res) => {
  
const OrderID = req.header('Order-Id');

const OrderInfo = DB.Order.findOne({where: {id: OrderID}})
const OrderItems = DB.OrderItem.findAll({where: {OrderId: OrderID}})

res.status(200).send({OrderInfo, OrderItems});



};
