const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../model/user');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        //Check Email Existe
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos'
            })
        }
        //Check Usuario Activo
        if (!usuario.state) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos - estado false'
            })
        }
        //Check Password
        const validarPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password incorrectos - password incorrecto'
            })
        }
        //Generate JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error)

        res.status(500).json({
            msg: 'Algo salio mal'
        });

    }

};


module.exports = {
    login
}