'use strict'

const {Router} = require('express');
const { addToCar, readCart, buys, readShop, productUser } = require('../controllers/bill.controller');
const {validateJWT} = require('../middlewares/validate-jwt');

const api = Router();

api.post('/addCart', validateJWT, addToCar);

api.get('/listCart', validateJWT, readCart);

api.post('/buys', validateJWT, buys);

api.get('/readShop', validateJWT, readShop);

api.get('/productUser',  validateJWT, productUser);

module.exports = api;