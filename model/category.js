
const {Schema, model} = require('mongoose')

const CategorySchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});


//Aqui tiene que ser una funcion normal y no de flecha 
CategorySchema.methods.toJSON = function() {
    //saco los valores que no quiero que devuelva cuando 
    // se consulta el objeto (__v, password)
    //unifico todos los otros atributos en la variable usuario.
    const { __v, state, ...data} = this.toObject();

    return data;
}

module.exports = model('Category', CategorySchema);