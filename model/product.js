
const { Schema, model } = require('mongoose')

const ProductSchema = Schema({
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
    precio: {
        type: Number,
        default: 0
    },
    description: { type: String },
    disponible: { type: Boolean, default: true },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    img: { type: String }
});

ProductSchema.methods.toJSON = function () {
    const { __v, state, ...data } = this.toObject();

    return data;
}

module.exports = model('Product', ProductSchema);