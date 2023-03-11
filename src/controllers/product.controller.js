'use strict'

const Product = require('../models/product.model');
const Categorys = require('../models/category.model');

//Crear producto dentro de una categoria
const createProduc = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        const {name, description, price, stock, categoryName} = req.body;
    try{

        let products = await Product.findOne({name});
        if(products){
            return res.status(400).send({
                message: 'Producto ya existente con el mismo nombre',
                ok: false,
                product: products,
            })
        };

        //Buscar la categoria por su name y ID
        const category = await Categorys.findOne({name: categoryName});
        const categoryId = category ? category._id : null;

        //Crear el producto y lo asignaremos a la categoria correspondiente
        const product = new Product({
            name,
            description,
            price,
            stock,
            category: categoryId,
        });

        //Si encontramos la categoria, agg mediante un ID los productos en el modelo categorias
        if(categoryId){
            await Categorys.findByIdAndUpdate(
                categoryId,
                {$push: {productos: product._id}},
                {new: true, useFindAndModify: false}
            )
        };

        //Guardamos
        await product.save();

        return res.status(201).json({
            message: 'Categoria creada correctamente',
            ok: true,
            product: product,
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al crear un producto',
            error: error,
        });
    }
    }else{
        res.status(401).send({
            message: 'Eres cliente, no tienes autorizacion para agregar productos'
        })
    }
};

//Listar los productos
const readProduct = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const productr = await Product.find();

            if(!productr){
                res.status(400).send({message: 'Productos agotado, o no hay productos'})
            }else{
                res.status(200).json({'Productos encontrados': productr})
            }
        }catch(error){
            throw new Error(error);
        }
    }else{
        return res
        .status(200)
        .send({
            message: 'Solo admin puede listar, ver estos productos'
        });
    }
};

//Listar el producto por nombre
const readProductByName = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        const {name} = req.body; //Se puede usar el params o body si da error
        try{
            const productr = await Product.findOne({name});

            if(!productr){
                res.status(400).send({message: 'Productos agotado, o no hay producto'})
            }else{
                res.status(200).json({'Productos encontrados': productr})
            }
        }catch(error){
            console.log(error)
            res
            .status(500)
            .json({
                message: 'Hubo error al buscar producto'
            })
        }
    }else{
        return res
        .status(200)
        .send({
            message: 'Solo admin puede listar, ver estos productos'
        });
    }
};

//Editar Producto
const updateProduct = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const {id} = req.params;
            const product = await Product.findByIdAndUpdate(id, req.body, {new: true});

            if(!product){
                return res.status(404).json({
                    message: 'Producto no existente'
                });
            }

            res.json(product);
        }catch(error){
            console.log(error)
            res.status(200).json({
                message: 'Error en el server'
            })
        }
    }else{
        return res.status(200).send({message: 'Solo admin puede editar, estos productos'})
    }
};

//Eliminar Producto
const deleteProduct = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const productId = req.params.id;
            const deleteProduct = await Product.findByIdAndDelete(productId);

            if(!deleteProduct){
                return res
                .status(404)
                .json({
                    message: 'Producto no existente, no encontrado'
                });
            }

            const categoryId = deleteProduct.category;

            const category = await Categorys.findById(categoryId);

            if(!category){
                return res
                .status(404).json({
                    message: 'Categoria del producto no existente',
                });
            }

            category.productos.pull(productId);
            await category.save();

            res.json({message: 'Producto eliminado'});

        }catch(error){
            console.log(error);
            res.status(500).json({message: 'Erro al eliminar el producto'})
        }
    }else{
        return res.status(200).send({message: 'Solo admin puede eliminar, estos productos'})
    }
};

//Productos agotados
const productSoldOut = async(req, res) => {
    if(req.user.rol === 'ADMIN'){
        try{
            //Buscar producto que el stok sea 0
            const product = await Product.find({stock: 0})

            //Si se encuentran productos mensaje que si se encontraron lo contrario estan Sold Out
            if(product.length > 0){ //length buscar entre todo el arreglo
                return res.json({
                    ok: true,
                    message: 'Productos encontrados',
                    product: product,
                }) 
            }else{
                return res.json({
                    ok: false,
                    message: 'No existen productos agotados' //Si no se encuentran algun producto
                });
            } 

        }catch(error){
            return res
            .status(200)
            .json({
                message: 'Error al mostrar productos agotados, o no se buscaron',
            })
        }
    }else{
        return res.status(200).send({message: 'Solo admin puede eliminar, estos productos'})
    }
};

module.exports = {createProduc, readProduct, readProductByName, updateProduct, deleteProduct, productSoldOut};