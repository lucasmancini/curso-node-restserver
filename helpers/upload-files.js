const path = require('path');
const { v4: uuidv4 } = require('uuid');


const uploadFileHelper = (files, validExtensions = ['jpg', 'jpeg', 'png', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        //Validar extension
        if (!validExtensions.includes(extension)) {
            return reject(`La extension ${extension} no es valida, solo se permiten ${validExtensions}`)
        }

        //archivo.name <-- original name
        const tempName = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

        archivo.mv(uploadPath, function (err) {
            if (err) {
                return reject(err);
            }

            resolve(tempName)
        });

    });
}

module.exports = {
    uploadFileHelper
}