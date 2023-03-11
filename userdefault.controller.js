'use strict'

const Usuarios = require('./src/models/user.model');
const bcrypt = require('bcrypt');
const {generateJWT} = require('./src/helpers/create-jwt');

//Usuario default
const userdefault = async() =>{
    try{
        const user = new Usuarios();
        user.name = 'Edgar';
        user.lastname = 'Gómez';
        user.email = 'egarcia2021400@kinal.edu.gt'
        user.password = 'SHANDER';
        user.rol = 'ADMIN';
        const userEncontrado = await Usuarios.findOne({email: user.email})

        if(userEncontrado) return console.log('El admin listo');

        //Encriptación de contraseña
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync());

         //Guardar usuario
         user = await user.save();

        if(!user) return console.log('El admin no listo');
        return console.log('El admin esta listo');

    }catch(error){
        console.log(error);
    }
};

module.exports = {userdefault};