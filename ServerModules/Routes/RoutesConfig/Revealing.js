const express = require('express'); 
const router = express.Router();
const Pego_Routes = require('./References');
const multer = require('multer');  
const os = require('os');
const CheckToken = require('../../Functions/CheckToken');
const OwnerCheck = require('../../Functions/StoreOwnerCheck');
const CheckOrderOwner = require('../../Functions/CheckOrderOwner');

const upload = multer({ dest: os.tmpdir() }); 

// Definição das rotas
router.post('/AuthLogin', Pego_Routes.AuthLogin);
router.post('/UserRegister', Pego_Routes.UserRegister);
router.post('/StoreRegister', CheckToken, Pego_Routes.StoreRegister);
router.get('/StoresListing', Pego_Routes.StoresListing);
router.get('/StoreData/:StoreID', Pego_Routes.StoreData);
router.post('/ProductRegister', CheckToken, OwnerCheck, upload.single('file'), Pego_Routes.ProductRegister);
router.get('/Store/:StoreID/Products', Pego_Routes.StoreProducts);
router.get('/Store/:StoreID/Product/:ProductID', Pego_Routes.StoreProductInfo);
 router.post('/NewOrder', CheckToken, Pego_Routes.NewOrder);
router.get('/CheckPayment', Pego_Routes.CheckPayment);
router.post('/AlterProductDisponibility', CheckToken, OwnerCheck, Pego_Routes.AlterProductDisponibility); 
router.get('/OrderInfo', CheckToken, CheckOrderOwner, Pego_Routes.OrderInfo); 
router.post('/RedeemOrder', CheckToken, OwnerCheck, Pego_Routes.RedeemOrder);

module.exports = router;
