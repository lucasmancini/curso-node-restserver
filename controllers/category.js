const { request, response } = require("express");
const { Category } = require('../model');

const getCategories = async (req = request, res = response) => {
    const { limit = 5, desde = 0, q = 'no name' } = req.query;
    const query = { state: true };

    const [total, categories] = await Promise.all([
        Category.countDocuments(query)
            .limit(Number(limit))
            .skip(Number(desde)),
        Category.find(query)
            .populate('usuario', 'nombre')
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    res.json({
        total,
        categories
    });
}

const getCategoryById = async (req = request, res = response) => {

    const id = req.body.id;
    const categoryDB = await Category.find({ id }).populate('usuario', 'nombre');

    res.json({
        category: categoryDB
    });

}

const crearCategory = async (req = request, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoryDB = await Category.findOne({ nombre });
    if (categoryDB) {
        return res.status(400).json({
            msg: `La categoria ${categoryDB.nombre}, ya existe`
        })
    }

    //Genero data a guardar en la category
    const data = {
        nombre,
        user: req.usuario._id
    }

    const category = new Category(data);
    await category.save();


    res.status(201).json(category)

}

const updateCategory = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, state, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const category = await Category.findByIdAndUpdate(id, data, {new: true});

    res.json(category);
}

const deleteCategory = async (req, res = response) => {
    const { id } = req.params;

    //Borrado Logico, actualizar el campo difinido para tal fin, ejemplo: estado: false, deleted: true, etc...
    const category = await Category.findByIdAndUpdate(id, { state: false });

    //const usuarioAutenticado = await req.usuario;
    
    res.status(200).json(category);
}

module.exports = {
    getCategories,
    getCategoryById,
    crearCategory,
    updateCategory,
    deleteCategory
}