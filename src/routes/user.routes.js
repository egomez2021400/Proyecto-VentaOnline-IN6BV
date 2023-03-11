'use strict'

const {Router} = require('express');
const { createUser,
        loginUser, 
        updateUser,
        deleteUser} = require('../controllers/user.controller');
const {check} = require('express-validator');
const {validateParams} = require('../middlewares/validate-params');
const {validateJWT} = require('../middlewares/validate-jwt');

const api = Router();

api.post('/create-user', createUser);

api.put('/update-user/:id', validateJWT, updateUser);

api.delete('/delete-user', validateJWT, deleteUser);

api.post('/login', loginUser);

module.exports = api;