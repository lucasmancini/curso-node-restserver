const { Product } = require('../model');
const Role = require('../model/role');

const isValidRole = async (rol = '') => {
    const existeRole = await Role.findOne({rol});
    if(!existeRole){
        throw new Error(`El rol ingresado [${rol}] es invalido.`)
    }
}

const nombreAlreadyExists = async (nombre = '') => {
    const existeNombre = await Product.findOne({nombre: nombre.toUpperCase() });
    if(existeNombre){
        throw new Error(`El nombre ingresado [${nombre}] para la product ya existe.`)
    }
}

const productExist = async (id = '') => {
    const existeProduct = await Product.findById(id);
    if(!existeProduct){
        throw new Error(`La product con id [${id}] no existe.`)
    }
}

module.exports = {
    isValidRole,
    nombreAlreadyExists,
    productExist
};