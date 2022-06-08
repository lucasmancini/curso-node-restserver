const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { uploadFileHelper } = require("../helpers");
const { Usuario, Product } = require('../model');



const uploadFile = async (req, res = response) => {

    try {
        const tempName = await uploadFileHelper(req.files, undefined, 'imgs');
        res.json({
            fileName: tempName
        })

    } catch (error) {
        res.status(400).json({ error });
    }


};

const updateImage = async (req, res = response) => {

    const { id, collection } = req.params;

    let modelo;

    switch (collection) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe el usuario con id: ${id}` });
            }

            break;
        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe el producto con id: ${id}` });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });

    }

    try {
        //Limpiar prev image on models
        if (modelo.img) {
            //Borrar image fisica
            const pathImagen = path.join(__dirname, '../uploads', collection, modelo.img)
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
            }
        }

        const fileName = await uploadFileHelper(req.files, undefined, collection);

        modelo.img = fileName;
        await modelo.save();

        res.json(modelo);
    } catch (error) {
        res.status(400).json({ error });
    }


}

const updateImageCloudinary = async (req, res = response) => {

    const { id, collection } = req.params;

    let modelo;

    switch (collection) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe el usuario con id: ${id}` });
            }

            break;
        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe el producto con id: ${id}` });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });

    }

    try {
        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.')

            cloudinary.uploader.destroy(public_id);
        }

        const { tempFilePath } = req.files.archivo;
        const resp = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = resp.secure_url

        await modelo.save();

        res.json(modelo);
    } catch (error) {
        res.status(400).json({ error });
    }


}

const shareImages = async (req, res = response) => {

    const { id, collection } = req.params;

    let modelo;

    switch (collection) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe el usuario con id: ${id}` //mostrar un placeholder en todo caso 
                });
            }

            break;
        case 'products':
            modelo = await Product.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `No existe el producto con id: ${id}` });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }


    try {
        if (modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads', collection, modelo.img)
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }

    } catch (error) {
        res.status(400).json({ error });
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg')
    if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
    }

    res.json({ msg: 'Placeholder Undefined' })
}

module.exports = {
    uploadFile,
    updateImage,
    updateImageCloudinary,
    shareImages
}
