const { Router } = require('express');
const { check } = require('express-validator');

const {
    getProducts,
    getProductById,
    crearProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/product');
const { categoryExist } = require('../helpers/category-db-validators');

const {
    productExist,
    nombreAlreadyExists } = require('../helpers/product-db-validators');

const {
    validarJWT,
    esAdminRole} = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = new Router();

router.get('/',getProducts,);

router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId().custom(productExist),
    validarCampos
], getProductById);

// POST- CUALQUIER CON TOKEN VALIDO
router.post('/', [
    validarJWT,
    check('nombre', 'Nombre obligatorio').not().isEmpty(),
    check('nombre').custom(nombreAlreadyExists),
    check('category', 'La categoria no existe').custom(categoryExist),
    validarCampos
], crearProduct);


// PUT - CUALQUIER CON TOKEN VALIDO
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').custom(productExist),
    check('nombre', 'Nombre obligatorio').not().isEmpty(),
    //check('nombre').custom(nombreAlreadyExists),
    check('category', 'La categoria no existe').custom(categoryExist),
    validarCampos
], updateProduct);

// PUT - SOLO TOKEN CON ROLE ADMIN
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId().custom(productExist),
    validarCampos
], deleteProduct);

module.exports = router;