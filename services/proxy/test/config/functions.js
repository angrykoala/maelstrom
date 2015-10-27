var http = require('http');
var express = require('express');
var serverConfig = require('./server.js');
var server;

//auxiliary functions for testing
module.exports = {
	setupServer: function(done) {
		var app = express();
		server = http.createServer(app);
		
		var io = require('socket.io')(server); //socket io listening to server
		var socketjwt = require('socketio-jwt');
		var socketEvents=require('../../app/events.js');

	/*	io.set('authorization',socketjwt.authorize({
			secret: serverConfig.secret,
			handshake: true
		}));*/

		io.on('connection', function(socket) {
			console.log(connected);
			//socketEvents(socket);
		});
		server.listen(serverConfig.port, function() {
			done();
		});
	},
	closeServer: function() {
		if (server) server.close();
	},
	generateToken: function(usr) {
			return jwt.sign({
				id: usr.id,
				username: usr.username
			}, serverConfig.secret, {
				expiresIn: 3600
			});
	}
}
