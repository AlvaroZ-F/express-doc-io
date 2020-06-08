var express = require('express');
var socketio = require('socket.io');
var http = require('http');

var users = [];

// App Setup
var app = express();
var server = http.createServer(app);
const io = socketio(server);

// Set Static Folder
app.use(express.static('public'));


io.on('connection', socket => {
	console.log('New user has entered with id' + socket.id);

	socket.on('para', (data) => {
		socket.broadcast.emit('updated_edit', data);
	});

	socket.on('username', function (data) {
		socket.broadcast.emit('newuser', data);
	});

	socket.on('userTyping', (data) => {
		socket.emit('useristyping', data);
	});

	socket.on('setUsername', (data) => {
		if (users.indexOf(data) == -1) {
			users.push(data);
			socket.emit('userSet', { username: data });
		} else {
			socket.emit('userExists', `${data} already exists, please change your username to enter`);
		}
	});

	// Broadcast when a user connects
	socket.broadcast.emit('message', 'An user has joined the application');

	// Runs when client disconnects
	socket.on('disconnect', () => {
		io.emit('message', 'An user has left the chat');
	});


	// Detect if user is writing in the document
	socket.on('typing', (data) => {
		if (data.typing == true) {
			io.emit('display', data);
		} else {
			io.emit('display', data);
		}
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));