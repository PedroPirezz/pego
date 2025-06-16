const DB = require("../../../Database/Variable/DBVar");
const express = require("express");
const router = express.Router();

module.exports = (req, res) => {
  DB.Stores.findAll({
    attributes: ['id', 'StoreName', 'StoreCity', 'StoreState']
  })
  .then(Stores =>
     res.send(Stores)
    );
};