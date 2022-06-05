
const {Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],    
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],    
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'El password es requerido'],    
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        enum: ['USER_ROLE', 'SUPER_ROLE']
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
});

//Aqui tiene que ser una funcion normal y no de flecha 
UsuarioSchema.methods.toJSON = function() {
    //saco los valores que no quiero que devuelva cuando 
    // se consulta el objeto (__v, password)
    //unifico todos los otros atributos en la variable usuario.
    const { __v, password, ...usuario} = this.toObject();    
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);