const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT } = require('../middlewares');

const { login, googleSignIn, refreshToken } = require('../controllers/auth');

const router = new Router();

router.get('/', validarJWT,
    refreshToken);

router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('id_token', 'id_token Google obligatorio').not().isEmpty(),
    validarCampos
], googleSignIn);


module.exports = router;