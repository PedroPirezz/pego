const express = require('express'); 
const bodyParser = require('body-parser'); 
const Routes = require('./ServerModules/Routes/RevealingRoutes/Revealing'); 
const path = require('path');
const app = express(); 



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', Routes); 

app.listen(80)