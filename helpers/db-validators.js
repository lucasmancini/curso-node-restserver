const Role = require('../model/role');
const Usuario = require('../model/usuario');

const isValidRole = async (rol = '') => {
    const existeRole = await Role.findOne({ rol });
    if (!existeRole) {
        throw new Error(`El rol ingresado [${rol}] es invalido.`)
    }
}

const isAlreadyEmailExist = async (email = '') => {
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
        throw new Error(`El email ingresado [${email}] ya existe.`)
    }
}

const userNotExist = async (id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El usuario con id [${id}] no existe.`)
    }
}
/**
 * Validar colecciones permitidas
 */
const allowedCollections = (collection = '', collections = []) => {
    const incluida = collections.includes(collection);
    if (!incluida) {
        throw new Error(`La collection no es permitida, permitidas: ${collections}`)
    }
    return true;
}

module.exports = {
    isValidRole,
    isAlreadyEmailExist,
    userNotExist,
    allowedCollections
};