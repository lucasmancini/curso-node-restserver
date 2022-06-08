const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../db/config');
const fileUpload = require('express-fileupload');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;


        this.paths = {
            auth: '/api/auth',
            category: '/api/category',
            product: '/api/product',
            search: '/api/search',
            user: '/api/users',
            upload: '/api/upload',
        }

        //Conectar a DB
        this.conectarDb();

        //Middlewares
        this.middlewares();

        //App Routes
        this.routes();
    }

    async conectarDb() {
        await dbConnection();
    }

    middlewares() {
        //CORS
        this.app.use(cors());

        // Lectura y Parseo del body
        this.app.use(express.json());

        //Public directory (tiliza esta carpeta publica antes de cualquier ruta)
        this.app.use(express.static('public'));

        //File Uploads
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        //.... todas las rutas que le siguen a la carpta public/index.html o index dentr de public y demas rutas

        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.category, require('../routes/category'));
        this.app.use(this.paths.user, require('../routes/users'));
        this.app.use(this.paths.product, require('../routes/product'));
        this.app.use(this.paths.search, require('../routes/search'));
        this.app.use(this.paths.upload, require('../routes/upload'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
        })
    }
}

module.exports = Server;