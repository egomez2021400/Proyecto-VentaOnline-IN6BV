'use strict'

const Usuarios = require('../models/user.model');
const Bill = require('../models/bill.model');
const bcrypt = require('bcrypt');
const {generateJWT} = require('../helpers/create-jwt');

const createUser = async(req, res) =>{
    const {name, email, password} = req.body;

    try{
        let usuario = await Usuarios.findOne({email});
        
        if(usuario){
            return res.status(400).send({
                message: 'Usuario ya existente con el correo',
                ok: false,
                usuario: usuario,
            });
        }

        usuario = new Usuarios(req.body);

        //Encriptación de contraseña
        const saltos = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, saltos);

        //Guardar usuarios
        usuario = await usuario.save();

        //Crear token
        const token = await generateJWT(usuario.id, usuario.name, usuario.email);
        res.status(200).send({
            message: `Usuario ${usuario.name} creado correctamente`,
            usuario,
            token: token,           
        });

        res.status(200).send({
            message: `Usuario ${name} creado`,
            ok: true,
            usuario: usuario,
        });

    }catch(error){
        console.log(error)
        res.status(500).json({ //Send o Json son lo mismo :D
            ok: false,
            message: `No se creo el usuario ${name}`,
            error: error,
        });
    }
};

const updateUser = async(req, res) =>{
    if(req.user.rol === 'CLIENT'){
        try{
            const id = req.params.id;
            let editUser = {...req.body};
    
            //Encriptación de contraseña
            editUser.password = editUser.password
            ? bcrypt.hashSync(editUser.password, bcrypt.genSaltSync())
            : editUser.password
    
            if(id !==req.user.id){
                return res
                .status(401)
                .send({
                    message: 'No tienes permiso para editar el perfil'
                });
            }
    
            const usercomplete = await Usuarios.findByIdAndUpdate(id, editUser, {
                new: true,
            });
    
            if(usercomplete) {
                const token = await generateJWT(usercomplete.id, usercomplete.name, usercomplete.email);
                return res.status(200).send({
                    message: "Usuario actualizado correctamente",
                    usercomplete,
                    token,
                });
            }else{
                res
                .status(404).send({
                    message: 'Este usuario no existe en la base de datos'
                })
            };
    
        }catch(error){
            throw new Error(error);
        }
    }else{
        return res.status(200).send({message: 'Eres ADMIN, solo usuarios pueden editar'});
    }
};

const deleteUser = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const id = req.user.id;
            const client = await Usuarios.findById(id);
        
            if(!client){
                return res.status(404).json({message: 'Usuario no existente'});
            }
        
            await client.remove();
        
            res.json({message: 'Usuario eliminado correctamente'})
        }catch(error){
            res.status(500).send('Error en el servidor')
        }
    }else{
        return res.status(200).send({message: 'Solo admin puede eliminar, este usuario'})
    }
};

const loginUser = async(req, res) =>{
    const {email, password} = req.body;
    try{
        const user = await Usuarios.findOne({email});
        if(!user){
            return res
            .status(400)
            .send({
                ok: false,
                message: 'Usuario no existente'
             });
        };

        const validatePassword = bcrypt.compareSync(
            password,
            user.password
        );

        if(!validatePassword){
            return res.status(400).send({
                ok: false,
                message: 'Password incorrecto',
            });
        };

        const token = await generateJWT(user.id, user.name, user.email);
        res.status(500)
        .json({
            message: `Usuario logeado correctamente, ${user.name}`,
            ok: true,
            uId: user.id,
            name: user.name,
            email: user.email,
            token: token,
        });
        
    }catch(error){
        res.status(500).json({
            ok: false,
            message: 'Usuario no registrado'
        });
    }
};

module.exports = {createUser, updateUser, deleteUser, loginUser};