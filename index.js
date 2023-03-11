'use strict'

const express = require("express");
const app = express();
const {connection} = require("./src/database/connection");
require('dotenv').config();
const port = process.env.PORT;
const user = require('./src/routes/user.routes');
const category = require('./src/routes/category.routes');
const product = require('./src/routes/product.routes');
const bill = require('./src/routes/bill.routers');
const {userdefault} = require('./userdefault.controller');

connection();

app.use(express.urlencoded({extended: false}));

app.use('/api', user, category, product, bill);

app.listen(port, function(){
    console.log(`El servidor esta conectado al puerto ${port}`);
});

userdefault();