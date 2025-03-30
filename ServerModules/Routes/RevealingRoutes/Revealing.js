const express = require('express'); 
const router = express.Router();
const NodeRoutes = require('./RoutesReferences');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

// Definição das rotas
router.post('/AuthLogin', NodeRoutes.AuthLogin);
router.post('/UserRegister', NodeRoutes.UserRegister);
router.post('/StoreRegister', NodeRoutes.StoreRegister);
router.get('/StoresListing', NodeRoutes.StoresListing);
router.get('/StoreData/:StoreID', NodeRoutes.StoreData);
router.post('/ProductRegister', upload.single('file'), NodeRoutes.ProductRegister);

module.exports = router;
