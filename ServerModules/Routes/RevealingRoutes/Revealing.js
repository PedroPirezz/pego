const express = require('express'); 
const router = express.Router();
const NodeRoutes = require('./RoutesReferences');
const multer = require('multer');
const os = require('os');
const authMiddleware = require('../../Functions/CheckToken');

const upload = multer({ dest: os.tmpdir() }); 

// Definição das rotas
router.post('/AuthLogin', NodeRoutes.AuthLogin);
router.post('/UserRegister', NodeRoutes.UserRegister);
router.post('/StoreRegister', authMiddleware, NodeRoutes.StoreRegister);
router.get('/StoresListing', NodeRoutes.StoresListing);
router.get('/StoreData/:StoreID', NodeRoutes.StoreData);
router.post('/ProductRegister', authMiddleware, upload.single('file'), NodeRoutes.ProductRegister);
router.get('/Store/:StoreID/Products', NodeRoutes.StoreProducts);
router.get('/Store/:StoreID/Product/:ProductID', NodeRoutes.StoreProductInfo);
module.exports = router;
