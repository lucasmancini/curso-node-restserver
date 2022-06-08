

const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const validarUploadFiles = require('../middlewares/validar-upload-files');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarUploadFiles
}