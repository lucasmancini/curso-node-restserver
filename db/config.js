const mongoose = require('mongoose');

const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.MONGODB_CONN, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('DB online')
        
    } catch (error) {
        console.log(error)
        throw new Error('Error al conectar a la Base de Datos');
    }

}

module.exports = {
    dbConnection
}