const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-node-lucas.herokuapp.com/api/auth/';

let usuario = null;
let socket = null;

//Ref Html
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');



const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No existe token en el servidor')
    }

    const resp = await fetch(url, {
        headers: { 'x-api-token': token }
    });


    const { usuario: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);

    usuario = userDB;
    document.title = usuario.nombre;

    await connectSocket();

}


const connectSocket = async () => {
    //Establecemos info importante con nuestro backend server
    socket = io({
        'extraHeaders': {
            'x-api-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket connect')
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnect')
    });

    socket.on('recibir-mensajes', (payload) => {
        dibujarMensajes(payload);
    });

    socket.on('usuarios-activos', (payload) => {
        dibujarUsuarios(payload)
    });

    socket.on('recibir-mensaje-privado', (payload) => {
        console.log(payload);
    });

}

const dibujarUsuarios = (usuarios = []) => {
    let usersHtml = '';

    usuarios.forEach(({ nombre, uid }) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">
                        ${nombre}
                    </h5>
                    <span class="fs-6 text-muted" >${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsuarios.innerHTML = usersHtml;
}

const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = '';

    mensajes.forEach(({ nombre, mensaje }) => {
        mensajesHtml += `
            <li>
                <p>
                    <sapan class="text-primary">
                        ${nombre}
                    </sapan>
                    <span>${mensaje}</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHtml;
}

btnSalir.addEventListener('click', () => {

    localStorage.removeItem('token');

    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload()
    });

});

txtMensaje.addEventListener('keyup', ({ keyCode }) => {

    if (keyCode !== 13) {
        return;
    }

    const mensaje = txtMensaje.value;
    const uid = txtUid.value;
    if ((mensaje.trim()).length === 0) {
        return;
    }

    socket.emit('enviar-mensaje', { mensaje, uid });

    txtMensaje.value = '';
});


const main = async () => {

    await validarJWT();
}

main();

