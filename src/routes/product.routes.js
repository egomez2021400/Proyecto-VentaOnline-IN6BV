'use strict'

const {Router} = require('express');
const { createProduc,
        readProduct,
        readProductByName, 
        updateProduct,
        deleteProduct,
        productSoldOut} = require('../controllers/product.controller');
const {validateJWT} = require('../middlewares/validate-jwt');

const api = Router();

api.post('/create-product', validateJWT, createProduc);

api.get('/read-product', validateJWT, readProduct);

api.get('/read-productName', validateJWT, readProductByName);

api.put('/update-product/:id', validateJWT, updateProduct);

api.delete('/delete-product/:id', validateJWT, deleteProduct);

api.get('/product-soldout', validateJWT, productSoldOut);

module.exports = api;
