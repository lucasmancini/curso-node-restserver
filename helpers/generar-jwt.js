const jwt = require('jsonwebtoken');
const { Usuario } = require('../model');

const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid }

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT')
            } else {
                resolve(token);
            }
        })


    })
}

const checkJWT = async (token = '') => {

    try {

        if (token.length < 10) {
            return null;
        }

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        const usuario = await Usuario.findOne({ '_id': uid, state: true });

        if (usuario) {
            return usuario;
        }
        else {
            return null;
        }


    } catch (error) {
        console.log(error);
        return null
    }
}

module.exports = {
    generarJWT,
    checkJWT
}