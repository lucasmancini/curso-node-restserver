const { request, response } = require("express");
const { isValidObjectId } = require("mongoose");
const allowedCollections = [
    'products',
    'roles',
    'users',
    'categories'
];

const { Usuario, Category, Role, Product } = require('../model');
const { count } = require("../model/category");

const searchUsers = async (termino = '', res = response) => {
    const isMongoId = isValidObjectId(termino);

    if (isMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.status(200).json({
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { email: regex }],
        $and: [{ state: true }]
    });

    res.status(200).json({
        //        totals: usuarios.count,
        results: usuarios
    });

}

const searchCategories = async (termino = '', res = response) => {
    const isMongoId = isValidObjectId(termino);

    if (isMongoId) {
        const category = await Category.findById(termino).populate('usuario', 'nombre');
        return res.status(200).json({
            results: (category) ? [category] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categories = await Category.find({ nombre: regex, state: true }).populate('usuario', 'nombre');

    res.status(200).json({
        results: categories
    });

}

const searchProducts = async (termino = '', res = response) => {
    const isMongoId = isValidObjectId(termino);

    if (isMongoId) {
        const product = await Product.findById(termino)
            .populate('usuario', 'nombre')
            .populate('category', 'nombre');
        return res.status(200).json({
            results: (product) ? [product] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const products = await Product.find({ nombre: regex, state: true })
        .populate('usuario', 'nombre')
        .populate('category', 'nombre');;

    res.status(200).json({
        results: products
    });

}

const searchRoles = async (termino = '', res = response) => {
    const isMongoId = isValidObjectId(termino);

    if (isMongoId) {
        const role = await Role.findById(termino);
        return res.status(200).json({
            results: (role) ? [role] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const roles = await Role.find({
        rol: regex,
        $and: [{ state: true }]
    });

    res.status(200).json({
        results: roles
    });

}

const searchDB = async (req = request, res = response) => {

    const { collection, query } = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${allowedCollections}`
        })
    }

    switch (collection) {
        case 'categories':
            searchCategories(query, res);
            break;
        case 'products':
            searchProducts(query, res);
            break;
        case 'roles':
            searchRoles(query, res);
            break;
        case 'users':
            searchUsers(query, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            });
    }

}

module.exports = {
    searchDB
}