const app = require("../app");
const io = ()=> app.io;

// We have to wait for the express HTTP server to be finished starting before we
// can use any of the socket.io stuff. 
app.onListen.push(function(){
	app.io.on('connection', (socket) => {
		console.log('User connected via WebsSocket')

		socket.on('disconnect', (socket) => {
			console.log('User disconnect via WebsSocket')
		});
	});
});


module.exports = io;