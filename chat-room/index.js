const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.get("/",(req,res)=>{
    return res.sendFile("/public/index.html");
});

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        if (name && name.trim()) {
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
        } else {
            socket.emit('name-error', 'Invalid name');
        }
    });

    socket.on('send', (message) => {
        if (users[socket.id] && message.trim()) {
            socket.broadcast.emit('receive', { message, name: users[socket.id] });
        }
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        }
    });
});

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
