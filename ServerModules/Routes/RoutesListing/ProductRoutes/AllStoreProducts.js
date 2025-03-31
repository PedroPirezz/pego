const DB = require("../../../Database/Variable/DBVar");
const express = require("express");
const router = express.Router();

module.exports = (req, res) => {
  let StoreID = req.params.StoreID;

  DB.Products.findAll({attributes: ['id', 'Name', 'Price', 'ImageUrl', 'StoreID'], where: {StoreID: StoreID, Available: true}})
  .then(Stores => {
      res.send(Stores);
    })
    .catch(error => {
      console.error("Error fetching stores:", error);
      res.status(500).send("Internal Server Error");
    });
};