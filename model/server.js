const express = require('express')
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.userRoutesPath = '/api/users';

        //Middlewares
        this.middlewares();

        //App Routes
        this.routes();
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
        //.... todas las rutas que le siguen a la carpta public/index.html o index dentr de public 
        // y demas rutas
        this.app.use( this.userRoutesPath, require('../routes/users'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}

module.exports = Server;