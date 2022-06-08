const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, shareImages, updateImageCloudinary } = require('../controllers/upload');
const { allowedCollections } = require('../helpers');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarUploadFiles } = require('../middlewares/validar-upload-files');

const router = new Router();

router.post('/', validarUploadFiles, uploadFile);

router.put('/:collection/:id', [
    validarUploadFiles,
    check('id').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['usuarios', 'products'])),
    validarCampos
], updateImageCloudinary /*updateImage*/);

router.get('/:collection/:id', [
    check('id').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['usuarios', 'products'])),
    validarCampos
], shareImages);

module.exports = router;