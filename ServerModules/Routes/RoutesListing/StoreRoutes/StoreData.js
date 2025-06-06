const DB = require("../../../Database/Variable/DBVar");
const express = require("express");
const router = express.Router();

module.exports = (req, res) => {
  let StoreID = req.params.StoreID;

  DB.Products.findOne({where: {id: 5}}).then(teste => {
    console.log(teste + "--------------------------------------------------");
    console.log(teste.ImageUrl + "--------------------------------------------------");
    
  })

  DB.Stores.findOne({where: {id: StoreID}}) 
  .then(Stores => {
      res.send(Stores);
    })
    .catch(error => {
      console.error("Error fetching stores:", error);
      res.status(500).send("Internal Server Error");
    });
};