const DB = require("../../../Database/Variable/DBVar");
const express = require("express");
const router = express.Router();

module.exports = (req, res) => {
  let Id = req.header("User-Id");
  DB.Order.findAll({
    where: { UserId: Id }, 
    attributes: ["id", "UserId", "Status", "createdAt", "TotalPrice"],
    order: [['createdAt', 'DESC']]
  }).then((Order) => {
    res.status(200).send(Order);
  })
 
 
};
