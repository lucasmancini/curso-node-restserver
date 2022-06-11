const myForm = document.querySelector('form');

const url = (window.location.hostname.includes('localhost'))
    ? 'http://localhost:8080/api/auth/'
    : 'https://restserver-curso-node-lucas.herokuapp.com/api/auth/';



myForm.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of myForm.elements) {
        if (el.name.length > 0) {
            formData[el.name] = el.value;
        }
    }

    fetch(url + 'login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
        .then(resp => resp.json())//extraemos de la respuesta el objeto json (paso extra del segundo then) 
        .then(({ msg, token }) => {
            if (msg) {
                return console.error(msg)
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(console.warn);
});


function handleCredentialResponse(response) {

    //Google Token: ID_TOKEN
    //console.log(response.credential);
    const data = { id_token: response.credential };

    fetch(url + 'google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(resp => resp.json())
        .then(({ token }) => {
            localStorage.setItem('token', token);
            window.location = 'chat.html';

        })
        .catch(console.warn);

}

const button = document.getElementById('google_signout');
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
        location.reload()
    })

}


