import axios from 'axios';

document.addEventListener('DOMContentLoaded', () => {
    const rsvp = document.querySelector('#rsvp');

    if (rsvp) {
        rsvp.addEventListener('submit', confirm);
    }
});

function confirm(e) {
    e.preventDefault();

    const btn = document.querySelector('#rsvp input[type="submit"]');
    let act = document.querySelector('#act').value;
    let message = document.querySelector('#message');

    while (message.firstChild) {
        message.removeChild(message.firstChild);
    }

    const data = {
        act,
    };

    axios.post(this.action, data).then((response) => {
        console.log(response);
        if (act === 'confirm') {
            document.querySelector('#act').value = 'cancel';
            btn.value = 'Cancel';
            btn.classList.remove('btn-azul');
            btn.classList.add('btn-rojo');
        } else {
            document.querySelector('#act').value = 'confirm';
            btn.value = 'Yes';
            btn.classList.remove('btn-rojo');
            btn.classList.add('btn-azul');
        }
        // console.log(response);
        message.appendChild(document.createTextNode(response.data));
    });
}
