var socketjwt = require('socketio-jwt');

module.exports = {
	port: process.env.PORT || 8081,
	secret: "dontpanic42",
	amqp: "amqp://localhost",
	//setup io socket
	setupIO: function(io){
		io.set('authorization',socketjwt.authorize({
			secret: this.secret,
			handshake: true
		}));		
	}
}
