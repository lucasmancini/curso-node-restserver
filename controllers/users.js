const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../model/user');
const { Promise } = require('mongoose');

const getUsuarios = async (req = request, res = response) => {

    const { limit = 5, desde = 0, q = 'no name' } = req.query;
    const query = { state: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .limit(Number(limit))
            .skip(Number(desde))
    ]);

    res.json({
        total,
        usuarios
    });
}

const postUsuario = async (req, res = response) => {

    const { nombre, email, password, rol } = req.body;
    const usuario = new Usuario({ nombre, email, password, rol });

    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //Save en DB
    await usuario.save();

    return res.json({
        usuario
    });

}

const putUsuario = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'put API - controlador usuarios',
        usuario
    });
}

const deleteUsuario = async(req, res = response) => {
    const { id } = req.params;
    
    //Borrado Logico, actualizar el campo difinido para tal fin, ejemplo: estado: false, deleted: true, etc...
    const usuario = await Usuario.findByIdAndUpdate(id, {state: false});

    const usuarioAutenticado = await req.usuario;

//        usuarioAutenticado,
    res.json({
        usuario,
    });
}

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}