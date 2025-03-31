const DB = require("../../../Database/Variable/DBVar");
const express = require("express");
const router = express.Router();

module.exports = (req, res) => {
  let StoreID = req.params.StoreID;
  let ProductID = req.params.ProductID; 

  DB.Products.findOne({ where: {StoreID: StoreID, id: ProductID, Available: true}})
  .then(Product => {
      res.send(Product);
    })
    .catch(error => {
      console.error("Error fetching stores:", error);
      res.status(500).send("Internal Server Error");
    });
};