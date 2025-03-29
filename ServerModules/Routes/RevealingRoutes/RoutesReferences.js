const UserRegister = require('../RoutesListing/Account/UserRegister')
const AuthLogin = require('../RoutesListing/Auth/AuthLogin')
const StoreRegister = require('../RoutesListing/Account/StoreRegister')
const StoresListing = require('../RoutesListing/GetInfo/StoresListing')
const StoreData = require('../RoutesListing/GetInfo/StoreData')



const NodeRoutes = {
   
    UserRegister,
    AuthLogin,
    StoreRegister,
    StoresListing,
    StoreData
};

module.exports = NodeRoutes;



