const { Socket } = require("socket.io");
const { checkJWT } = require("../helpers");

const { ChatMensajes } = require('../model');
const chatMensajes = new ChatMensajes();

const socketController = async (socket = new Socket(), io) => {
    //Recibiendo el objeto io, podemos brodcastear a todo el mundo directamente sin usar dos senticas 
    //socket.emit() + socket.broadcast.emit()... utilizamos solo io.emit() 

    const usuario = await checkJWT(socket.handshake.headers['x-api-token']);
    if (!usuario) {
        return socket.disconnect();
    }

    //Agregar usuario conetado
    chatMensajes.conectarUsuario(usuario);

    //Envio a todos los sockets
    io.emit('usuarios-activos', chatMensajes.usuariosArr);

    //Solo al socket que se acaba de conectar le mandamos los ultimos 10
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    //Conectarlo a una sala especial,
    socket.join(usuario.id);//global, socket.id, usuario.id <<--salas a las que se conecta un socket o cliente

    //Limpiar usuario desconectado, en el evento disconnect
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);

        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });


    //Escucho el evento enviar-mensaje del cliente
    socket.on('enviar-mensaje', ({ mensaje, uid }) => {

        if (uid) {
            //Mensaje privado a un socket con la sala uid que lo agregamos en la linea 26  
            socket.to(uid).emit('recibir-mensaje-privado', {
                de: usuario.nombre,
                mensaje
            })



        } else {

            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);

            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    });





    // send a message to the client
    // socket.emit("Hello from server", 1, "2", { 3: Buffer.from([4]) });

    // receive a message from the client
    // socket.on("Hello from client", (...args) => {
    //     // ...

    // });

}
module.exports = {
    socketController
}