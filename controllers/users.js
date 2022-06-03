const { response } = require('express');

const getUsuarios = (req = request, res = response) => {

    const {limit = 10, q = 'no name'} = req.query;

    res.json({
        id: 1,
        limit,
        q
    });
}

const postUsuario = (req, res = response) => {

    const {edad, nombre} = req.body;

    res.json({
        id: 1,
        msg: 'post API - controlador usuarios',
        edad,
        nombre,
    });
}

const putUsuario = (req, res = response) => {

    const id = req.params.id;

    res.json({
        id,
        msg: 'put API - controlador usuarios',

    });
}

const deleteUsuario = (req, res = response) => {
    res.json({
        id: 1,
        msg: 'delete API - controlador usuarios'
    });
}

module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario
}