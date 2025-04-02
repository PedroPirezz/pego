const express = require('express'); 
const router = express.Router();
const Pego_Routes = require('./References');
const multer = require('multer');  
const os = require('os');
const authMiddleware = require('../../Functions/CheckToken');
const OwnerCheck = require('../../Functions/StoreOwnerCheck');

const upload = multer({ dest: os.tmpdir() }); 

// Definição das rotas
router.post('/AuthLogin', Pego_Routes.AuthLogin);
router.post('/UserRegister', Pego_Routes.UserRegister);
router.post('/StoreRegister', authMiddleware, Pego_Routes.StoreRegister);
router.get('/StoresListing', Pego_Routes.StoresListing);
router.get('/StoreData/:StoreID', Pego_Routes.StoreData);
router.post('/ProductRegister', authMiddleware, OwnerCheck, upload.single('file'), Pego_Routes.ProductRegister);
router.get('/Store/:StoreID/Products', Pego_Routes.StoreProducts);
router.get('/Store/:StoreID/Product/:ProductID', Pego_Routes.StoreProductInfo);
 router.post('/NewOrder', authMiddleware, Pego_Routes.NewOrder);
router.get('/CheckPayment', Pego_Routes.CheckPayment);

module.exports = router;
