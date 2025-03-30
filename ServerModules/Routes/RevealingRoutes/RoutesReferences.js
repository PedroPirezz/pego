const UserRegister = require('../RoutesListing/Account/UserRegister')
const AuthLogin = require('../RoutesListing/Auth/AuthLogin')
const StoreRegister = require('../RoutesListing/Account/StoreRegister')
const StoresListing = require('../RoutesListing/Get/StoresListing')
const StoreData = require('../RoutesListing/Get/StoreData')
const ProductRegister = require('../RoutesListing/Post/ProductRegister')



const NodeRoutes = {
   
    UserRegister,
    AuthLogin,
    StoreRegister,
    StoresListing,
    StoreData,
    ProductRegister
};

module.exports = NodeRoutes;



