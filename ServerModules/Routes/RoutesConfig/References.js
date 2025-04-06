const UserRegister = require('../RoutesListing/AuthRoutes/UserRegister')
const AuthLogin = require('../RoutesListing/AuthRoutes/AuthLogin')
const StoreRegister = require('../RoutesListing/AuthRoutes/StoreRegister')
const StoresListing = require('../RoutesListing/StoreRoutes/StoresListing')
const StoreData = require('../RoutesListing/StoreRoutes/StoreData')
const ProductRegister = require('../RoutesListing/ProductRoutes/ProductRegister')
const StoreProducts = require('../RoutesListing/ProductRoutes/AllStoreProducts')
const StoreProductInfo = require('../RoutesListing/ProductRoutes/ProductInfo')
const NewOrder = require('../RoutesListing/OrderRoutes/NewOrder')

const AlterProductDisponibility = require('../RoutesListing/ProductRoutes/AlterProductDisponibility')
const OrderInfo = require('../RoutesListing/OrderRoutes/OrderInfo')
const RedeemOrder = require('../RoutesListing/OrderRoutes/RedeemOrder')


const NodeRoutes = {
   
    UserRegister,
    AuthLogin,
    StoreRegister,
    StoresListing,
    StoreData,
    ProductRegister,
    StoreProducts,
    StoreProductInfo,
    NewOrder,
    AlterProductDisponibility,
    OrderInfo,
    RedeemOrder
};

module.exports = NodeRoutes;



