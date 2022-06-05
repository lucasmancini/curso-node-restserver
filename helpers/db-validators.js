const Role = require('../model/role');
const Usuario = require('../model/user');

const isValidRole = async (rol = '') => {
    const existeRole = await Role.findOne({rol});
    if(!existeRole){
        throw new Error(`El rol ingresado [${rol}] es invalido.`)
    }
}

const isAlreadyEmailExist = async (email = '') => {
    const existeEmail = await Usuario.findOne({email});
    if(existeEmail){
        throw new Error(`El email ingresado [${email}] ya existe.`)
    }
}

const userNotExist = async (id = '') => {
    const existeUser = await Usuario.findById(id);
    if(!existeUser){
        throw new Error(`El usuario con id [${id}] no existe.`)
    }
}

module.exports = {
    isValidRole,
    isAlreadyEmailExist,
    userNotExist
};