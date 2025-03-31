const bcrypt = require("bcryptjs");
const DB = require("../../../Database/Variable/DBVar");
const express = require("express");
const router = express.Router();



module.exports = (req, res) => {

    //FORM INPUTS
    let InputStoreIdOwner = req.body.IdOwner;
    let InputStoreName = req.body.Name;
    let InputStoreDescription = req.body.Description;
    let InputStoreCategory = req.body.Category;
    let InputStoreEmail = req.body.Email;
    let InputStoreNumberPhone = req.body.NumberPhone;
    let InputStoreAddress = req.body.Address;
    let InputStoreCity = req.body.City;
    let InputStoreState = req.body.State;
    let InputStoreCEP = req.body.Cep;
    let InputStoreAdressNumber = req.body.AdressNumber;
    let InputStoreOpeningHours = req.body.OpeningHours;

    
    if (!InputStoreIdOwner || !InputStoreName || !InputStoreDescription || !InputStoreCategory || !InputStoreEmail || !InputStoreNumberPhone || !InputStoreAddress || !InputStoreCity || !InputStoreState || !InputStoreCEP || !InputStoreAdressNumber || !InputStoreOpeningHours) {
        res.send("Please fill in all fields");
    }
    else
    {
        DB.Stores.create({
            StoreIdOwner: InputStoreIdOwner,
            StoreName: InputStoreName,
            StoreDescription: InputStoreDescription,
            StoreCategory: InputStoreCategory,
            StoreEmail: InputStoreEmail,
            StoreNumberPhone: InputStoreNumberPhone,
            StoreAddress: InputStoreAddress,
            StoreCity: InputStoreCity,
            StoreState: InputStoreState,
            StoreCEP: InputStoreCEP,
            StoreAdressNumber: InputStoreAdressNumber,
            StoreOpeningHours: InputStoreOpeningHours
        }).then(() => {
            res.send("Store Registered Successfully");
        }).catch((error) => {
            console.error("Error in store registration:", error);
            res.status(500).send("Internal Server Error");
        });
    }
       
}

