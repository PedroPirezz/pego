const express = require('express'); 
const router = express.Router();
const NodeRoutes = require('./RoutesReferences');
// const CheckToken = require('../../Functions/CheckToken');



router.post('/AuthLogin', NodeRoutes.AuthLogin);
router.use('/UserRegister', NodeRoutes.UserRegister);
router.use('/StoreRegister', NodeRoutes.StoreRegister);
router.use('/StoresListing', NodeRoutes.StoresListing);
router.use('/StoreData/:StoreID', NodeRoutes.StoreData);


module.exports = router