const { Category } = require('../model');
const Role = require('../model/role');

const isValidRole = async (rol = '') => {
    const existeRole = await Role.findOne({rol});
    if(!existeRole){
        throw new Error(`El rol ingresado [${rol}] es invalido.`)
    }
}

const nombreAlreadyExists = async (nombre = '') => {
    const existeNombre = await Category.findOne({nombre: nombre.toUpperCase() });
    if(existeNombre){
        throw new Error(`El nombre ingresado [${nombre}] para la category ya existe.`)
    }
}

const categoryExist = async (id = '') => {
    const existeCategory = await Category.findById(id);
    if(!existeCategory){
        throw new Error(`La category con id [${id}] no existe.`)
    }
}

module.exports = {
    isValidRole,
    nombreAlreadyExists,
    categoryExist
};