const dbValidators = require('./db-validators');
const categoryDbValidators = require('./category-db-validators');
const productValidator = require('./product-db-validators');
const generarJwt = require('./generar-jwt');
const googleVerify = require('./google-verify');
const uploadFiles = require('./upload-files');


module.exports = {
     ...dbValidators,
     ...categoryDbValidators,
     ...productValidator, 
     ...generarJwt,
     ...googleVerify,
     ...uploadFiles
}