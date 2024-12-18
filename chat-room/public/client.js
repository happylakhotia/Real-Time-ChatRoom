const socket = io();

const form = document.getElementById("send-container");
const messageInput = document.getElementById("msginp");
const messageContainer = document.querySelector('.container');

var audio = new Audio('ting.mp3');

const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message", position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};

let namee = '';
while (!namee || namee.trim() === '') {
    namee = prompt("Enter your name to join");
}
socket.emit('new-user-joined', namee);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});

socket.on('user-joined', nam => {
    if (nam) append(`${nam} joined the chat`, 'right');
});

socket.on('receive', data => {
    if (data.name && data.message) {
        append(`${data.name}: ${data.message}`, 'left');
    }
});

socket.on('left', name => {
    if (name) append(`${name} left the chat`, 'left');
});
