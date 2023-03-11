const {request, response} = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const Usuarios = require("../models/user.model");

const validateJWT = async(req = request, res = response, next) =>{
    const token = req.header("x-token");

    if(!token){
        return res.status(401).send({
            message: "No hay token en la petición",
        });
    };

    try{
        //Decodificar token
        const payload = jwt.decode(token, process.env.SECRET_KEY);
        //Usuario se buscara por medio del ID
        const userEncontrado = await Usuarios.findById(payload.uId);
        console.log(userEncontrado);

        //Verificar token que no ha expirado
        if(payload.exp <= moment().unix()){
            return res.status(500).send({message: 'El token ha expirado'});
        };

        //Verificar el usuario sigue existiendo
        if(!userEncontrado){
            return res.status(401).send({
                message: "Token no valido - usuario no existe en la Base de Datos"
            });
        };

        req.user = userEncontrado;
        next();
    }catch(error){
        throw new Error(Error);
    }
};

module.exports = {validateJWT};