'use strict'

const Categorys = require('../models/category.model');
const Product = require('../models/product.model');

const createCategory = async(req, res) => {
    if(req.user.rol === 'ADMIN'){
    const {name, description} = req.body;
    try{
        let category = await Categorys.findOne({name});
        
        if(category){
            return res.status(400).send({
                message: 'Categoria ya creada',
                ok: false,
                category: category,
            });    
        }

        category = new Categorys({name, description});
        
        category = await category.save();

        res
        .status(200)
        .send({
            message: 'Categoria creada correctamente',
            ok: true,
            category: category,
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'No se ha creado aun el categoria',
            error: error,
        });
    }
    }else{
        return res
        .status(200)
        .send({
            message: 'Eres cliente, no puedes agregar una categoria'
        });
    }
};

const readCategory = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const categorys = await Categorys.find();
    
            if(!categorys){
                res.status(404).send({
                    message: 'No hay categorias'
                });
            }else{
                res.status(200).json({'Categoria encontradas': categorys})
            }
    
        }catch(error){
            throw new Error(error);
        }
    }else{
        res.status(401).send({
            message: 'Eres cliente, no tiene autorizacion para listar'
        });
    }
};

const readCategoryByName = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        const {name} = req.body; //Se puede usar el params o body si da error
        try{
            const category = await Categorys.findOne({name});

            if(!category){
                res.status(400).send({message: 'Categoria no existente'})
            }else{
                res.status(200).json({'Categorias encontradas': category})
            }
        }catch(error){
            console.log(error)
            res
            .status(500)
            .json({
                message: 'Hubo error al buscar Categoria'
            })
        }
    }else{
        return res
        .status(200)
        .send({
            message: 'Solo admin puede listar, ver estas Categorias'
        });
    }
};

const updateCategory = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const {id} = req.params;
            const category = await Categorys.findByIdAndUpdate(id, req.body, {new: true});

            if(!category){
                return res.status(404).json({
                    message: 'Categoria no existente'
                });
            }

            res.json(category);
        }catch(error){
            console.log(error)
            res.status(200).json({
                message: 'Error en el server'
            })
        }
    }else{
        return res.status(200).send({message: 'Solo admin puede editar, estas Categorias'})
    }
};

const deleteCategory = async(req, res) =>{
    if(req.user.rol === 'ADMIN'){
        try{
            const categoryId = req.params.id;

            //Buscar la categoria por medio del ID y obtener los productos que contiene esta categoria
            const category = await Categorys.findById(categoryId).populate('productos');//Obtener los productos en dicha categoria populate
            const products = category.productos;//El producto viene del modelo categoria linea 9

            //Si eliminan la categoria, se pasaran a una categoria default los productos
            if(products.length > 0){
                //Buscar la categoria default
                let defaultCategory = await Categorys.findOne({name: 'default'});
                
                //Si no existe la categoria, se va crear una
                if(!defaultCategory){
                    const newDefault = new Categorys({
                        name: 'default',
                        description: 'Productos sin categoria',
                        productos: products.map((product) => product._id),
                    });

                    defaultCategory = await newDefault.save();
                }else{
                    defaultCategory.products.push(...products.map((product) => product._id));
                    
                    await defaultCategory.save(); 
                }
                
                const promises = products.map(async (product) =>{
                    product.category = defaultCategory._id;
                    await product.save();
                });

                await Promise.all(promises);
            }

            await Categorys.findByIdAndDelete(categoryId);

            res.json({message: 'Categoria eliminada correctamente'});

        }catch(error){
            console.log(error);
            res.status(500).send({
                message: 'Error al eliminar la categoria'
            })
        }
    }else{
        return res.status(200).send({message: 'Solo admin puede eliminar, esta Categoria'})
    }
};

module.exports = {createCategory, readCategory, readCategoryByName, updateCategory, deleteCategory};