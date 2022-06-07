const { Router } = require('express');
const { check } = require('express-validator');

const {
    getCategories,
    getCategoryById,
    crearCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/category');

const {
    categoryExist,
    nombreAlreadyExists } = require('../helpers/category-db-validators');

const {
    validarJWT,
    hasRole, 
    esAdminRole} = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = new Router();

// GET TODAS LAS CATEGORIAS - public

router.get('/', getCategories);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId().custom(categoryExist),
    validarCampos
], getCategoryById);

// POST- CUALQUIER CON TOKEN VALIDO
router.post('/', [
    validarJWT,
    check('nombre', 'Nombre obligatorio').not().isEmpty(),
    validarCampos
], crearCategory);


// PUT - CUALQUIER CON TOKEN VALIDO
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').custom(categoryExist),
    check('nombre', 'Nombre obligatorio').not().isEmpty(),
    check('nombre').custom(nombreAlreadyExists),
    validarCampos
], updateCategory);

// PUT - SOLO TOKEN CON ROLE ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId().custom(categoryExist),
    validarCampos
], deleteCategory);

module.exports = router;