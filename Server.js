const express = require('express'); 
const bodyParser = require('body-parser'); 
const Routes = require('./ServerModules/Routes/RoutesConfig/Revealing'); 
const app = express(); 

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/', Routes); 

app.listen(80)