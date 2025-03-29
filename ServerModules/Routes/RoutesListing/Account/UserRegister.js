const bcrypt = require("bcryptjs");
const DB = require("../../../Database/Variable/DBVar");
const express = require("express");
const router = express.Router();


module.exports= (req, res) => {

  //FORM INPUTS
let Email = req.body.Email;
let Password = req.body.Password;
let Name = req.body.Name; 
let CPF_CNPJ = req.body.Cpf_Cnpj;
let AccountType = "Personal"; 
let NumberPhone = req.body.NumberPhone;

//PASS CRIPITOGRAPHY
const salt = bcrypt.genSaltSync(10); 
let Pass = bcrypt.hashSync(Password, salt);
let FirstToken = bcrypt.hashSync(Email, salt); 


//CHECK IF ALL FIELDS ARE FILLED
if (!Email || !Password || !Name || !CPF_CNPJ || !NumberPhone) {
    res.send("Please fill in all fields");
}
else
{

//CHECK IF USER ALREADY EXISTS
DB.Users.findOne({ where: { Email: Email } }).then(user => {
    if (user) { 
        res.send("User Already Exists");
    } else {
        
        //CREATE USER
DB.Users.create({
    Email: Email,
    Password: Pass,
    Name: Name,
    CPF_CNPJ: CPF_CNPJ,
    AccountType: AccountType,
    NumberPhone: NumberPhone,
    Token: FirstToken
    })
        res.send("User Created Successfully"); 
    }
});
}



};