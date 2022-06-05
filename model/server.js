const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../db/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userRoutesPath = '/api/users';

        //Conectar a DB
        this.conectarDb();

        //Middlewares
        this.middlewares();

        //App Routes
        this.routes();
    }

    async conectarDb(){
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        // Lectura y Parseo del body
        this.app.use( express.json() ); 

        //Public directory (tiliza esta carpeta publica antes de cualquier ruta)
        this.app.use(express.static('public'));
    }

    routes() {
        //.... todas las rutas que le siguen a la carpta public/index.html o index dentr de public y demas rutas
        this.app.use( this.userRoutesPath, require('../routes/users'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}

module.exports = Server;