
const { Router } = require('express');
const {
    getUsuarios,
    putUsuario,
    postUsuario,
    deleteUsuario
} = require('../controllers/users');

const router = new Router();

router.get('/', getUsuarios);

router.post('/', postUsuario);

router.put('/:id', putUsuario);

router.delete('/', deleteUsuario);

module.exports = router;