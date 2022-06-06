const { response } = require("express")
const { request } = require("express")



const esAdminRole = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin verificar el token primero'
        })
    }

    const { rol, nombre } = req.usuario;
    console.log(rol);

    if (rol !== 'ADMIN_ROLE') {

        return res.status(401).json({
            msg: `User ${nombre} no es ADMIN`
        })

    }

    next();

}

//Passing args in middleware is possible with this way ...roles for example
const hasRole = (...roles) => {

    return (req, res = response, next) => {

        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin verificar el token primero'
            })
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El User ${req.usuario.nombre} require uno de estos roles ${roles}`
            })          
        }
//        console.log(roles, req.usuario.rol)

        next();
    }

}



module.exports = {
    esAdminRole,
    hasRole
}