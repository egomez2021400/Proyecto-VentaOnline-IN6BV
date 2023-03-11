'use strict'

const {Router} = require('express');
const { createCategory, readCategory, readCategoryByName, updateCategory, deleteCategory } = require('../controllers/category.controller');
const {validateJWT} = require('../middlewares/validate-jwt');

const api = Router();

api.post('/create-category', validateJWT, createCategory);

api.get('/list-category', validateJWT, readCategory);

api.get('/list-categoryName', validateJWT, readCategoryByName);

api.put('/update-category/:id', validateJWT, updateCategory);

api.delete('/delete-category/:id', validateJWT, deleteCategory);

module.exports = api;