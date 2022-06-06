const { request } = require('express')
const { response } = require('express')
const jwt = require('jsonwebtoken')
const Usuario = require('../model/user');

const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-api-token');

    if (!token) {
        return res.status(400).json({
            msg: 'No token found'
        })
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        
        // leer usuario con el uid 
        const usuario = await Usuario.findById(uid);

        //Check if usuario exists in DB
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - user not exists in db'
            })
        }

        //Check if usuario state is true
        if (!usuario.state) {
            return res.status(401).json({
                msg: 'Token no valido - user state is false'
            })            
        }

        req.usuario = usuario;

        next();

    } catch (error) {

        console.log(error);
        return res.status(401).json({
            msg: 'Token no valido'
        })

    }




}


module.exports = {
    validarJWT
}