const { request, response } = require("express");
const { Product } = require('../model');

const getProducts = async (req = request, res = response) => {
    const { limit = 5, desde = 0, q = 'no name' } = req.query;
    const query = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query)
            .limit(Number(limit))
            .skip(Number(desde)),
        Product.find(query)
            .populate('usuario', 'nombre')
            .populate('category', 'nombre')
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    res.json({
        total,
        products
    });
}

const getProductById = async (req = request, res = response) => {

    const id = req.body.id;
    const productDB = await Product.find({ id })
    .populate('usuario', 'nombre')
    .populate('category', 'nombre');

    res.json({
        product: productDB
    });

}

const crearProduct = async (req = request, res = response) => {

    const {state, usuario, ...body} = req.body;

    //Genero data a guardar en la product
    const data = {
        ...body,
        nombre: req.body.nombre.toUpperCase(),
        usuario: req.usuario._id,
        category: req.body.category
    }

    const product = new Product(data);
    await product.save();

    res.status(201).json(product)

}

const updateProduct = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, state, usuario, category, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();        
    }
    data.usuario = req.usuario._id;

    const product = await Product.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json(product);
}

const deleteProduct = async (req, res = response) => {
    const { id } = req.params;

    //Borrado Logico, actualizar el campo difinido para tal fin, ejemplo: estado: false, deleted: true, etc...
    const product = await Product.findByIdAndUpdate(id, { state: false });

    //const usuarioAutenticado = await req.usuario;
    
    res.status(200).json(product);
}

module.exports = {
    getProducts,
    getProductById,
    crearProduct,
    updateProduct,
    deleteProduct
}