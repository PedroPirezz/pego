const DB = require("../../../Database/Variable/DBVar");
const express = require("express");
const router = express.Router();

module.exports = async (req, res) => {
  try {
    const OrderID = req.header("Order-Id");

    if (!OrderID) {
      return res.status(400).json({ error: "Order-Id header is required" });
    }


    const OrderInfo = await DB.Order.findOne({ where: { id: OrderID } });
    const OrderItems = await DB.OrderItem.findAll({ where: { OrderId: OrderID } });
    console.log(OrderInfo.PixQrCode);

  
    if (!OrderInfo) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ OrderInfo, OrderItems });

  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
