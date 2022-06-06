
const { Router } = require('express');
const { check } = require('express-validator');

const {
    getUsuarios,
    putUsuario,
    postUsuario,
    deleteUsuario
} = require('../controllers/users');

const { isValidRole,
    isAlreadyEmailExist,
    userNotExist
} = require('../helpers/db-validators');

const {
    validarCampos,
    validarJWT,
    hasRole
} = require('../middlewares');

const router = new Router();

router.get('/', getUsuarios);

router.post('/', [
    check('nombre', 'Nombre requerido.').not().isEmpty(),
    check('password', 'Password deber ser mayor a 6 caracteres.').isLength({ min: 6 }),
    //check('rol', 'Rol Invalid').isIn(['USER_ROLE', 'SUPER_ROLE']),
    check('email', 'Email not valid.').isEmail().custom(isAlreadyEmailExist),
    check('rol').custom(isValidRole),
    validarCampos
], postUsuario);

router.put('/:id', [
    check('id', 'No es un ID valido').isMongoId().custom(userNotExist),
    validarCampos
], putUsuario);

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    hasRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE', 'ETC_ROLE'),
    check('id', 'No es un ID valido').isMongoId().custom(userNotExist),
    validarCampos
], deleteUsuario);

module.exports = router;