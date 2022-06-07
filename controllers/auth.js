const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../model/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response,) => {

    const { id_token } = req.body;

    try {

        const {nombre, img, email} = await googleVerify(id_token);

        //Verificar si existe el correo 
        let usuario = await Usuario.findOne({email});
        

        if (!usuario) {
            //Crear usuario
            const data = {
                nombre,
                email,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario existe en DB
        if (!usuario.state) {
            return res.status(401).json({
                    msg: 'Usuario bloqueado, hable con el admin'
            });
        }
        
        //Generar el JWT
        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        });
    
    } catch (error) {
        
        res.status(400).json({
            ok:false,
            msg: 'El Token no se pudo verificar'
        })
        
    }




}

module.exports = {
    login,
    googleSignIn
}