const express = require("express");
const DB = require("../../../Database/Variable/DBVar");
const router = express.Router();

module.exports = async (req, res) => {

let OrderId = req.header("Order-Id");
try {
    if (!OrderId) {
        return res.status(400).json({ error: "Order-Id header is required" });
    }
    else{
      let Order = await DB.Order.findOne({ attributes: ['Status']}, { where: { id: OrderId } });  
    
      if (!Order) {
        return res.status(404).json({ error: "Order not found" });
      }
      if(Order.Status == "PAID")
      {
        await DB.Order.update({ Status: "redeemed" }, { where: { id: OrderId } });
      }
      else 
      {
        return res.status(400).json({ error: "Order already redeemed" });
      }
    }
} catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
}



};
