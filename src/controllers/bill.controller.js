'use strict'

const Usuarios = require('../models/user.model');
const Product = require('../models/product.model');
const Bill = require('../models/bill.model');

const addToCar = async(req, res) => {
    try{
        const {productId, quantity} = req.body;
        const userId = req.user.id;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no existente' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Stock menor o no hay' });
        }

        const user = await Usuarios.findByIdAndUpdate(
        userId,
            { $push: {carrito: {nombre: productId, cantidad: quantity }}},
            { new: true }
            ).populate('carrito.nombre');

        product.stock -= quantity;
        await product.save();

        res.status(200).json(user);

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const readCart = async(req, res) =>{
    try{
        const user = await Usuarios.findById(req.user._id).populate('carrito.nombre');

        res.status(200).json(user.carrito);
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'Error en el carrito'})
    }
};

const buys = async(req, res) =>{
    try{
        const userId = req.user.id;

        const user = await Usuarios.findById(userId);

        const products = user.carrito;

        let total = 0;

        const billProducts = [];
        for (const product of products){
            const foundProduct = await Product.findById(product.nambre);
            const subtotal = foundProduct.price * product.cantidad;
            total += subtotal;
            billProducts.push({product: foundProduct, quantity: product.cantidad, subtotal});
        }
        const bill = new Bill({user: user, product: billProducts, total});
        await bill.save();

        user.carrito = [];
        await user.save();

        res.status(200).json(bill);

    }catch(error){
        console.log(error);
        res.status(500).json({
            message: 'Error en el servidor'
        })
    }
};

const readShop = async(req, res) =>{
    try{
        const userId = req.user.id;
        const bills = await Bill.find({user: userId}).populate('products.product');
        if(bills.length > 0 ){
            res.status(200).json(bills);
        }else{
            res.status(400).json({
                message: 'No se encontro factura'
            })
        }
    }catch(error){
        res.status(500).json({
            message: 'Error en el servidor'
        })
    }
};

const productUser = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const userId = req.body.userId;
            const user = await Usuarios.findById(userId);

            if(!user){
                return res.status(404).json({
                    message: 'Usuario no existente'
                })
            }

            //Factura del usuario
            const bills = await Bill.find({user: userId}).populate({
                path: 'products.product',
                model: 'Products',
                select: 'name Price',
            })

            return res.json({bills})

        }catch(error){
            console.log(error);
            res.status(500).json({
                message: 'Error en el servidor'
            })
        }
    }else{
        return res.status(200).send({
            message: 'Solo admin puede ejecutar esta acción'
        })
    }
};

module.exports = {addToCar, readCart, buys, readShop, productUser};