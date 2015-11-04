var http = require('http');
var express = require('express');
var serverConfig = require('../../config/server.js');
var jwt = require('jsonwebtoken');
var server;

//auxiliary functions for testing
module.exports = {
	setupServer: function(done) {
		var app = express();
		server = http.createServer(app);

		var io = require('socket.io')(server); //socket io listening to server
		var socketEvents = require('../../app/events.js');

		serverConfig.setupIO(io);

		io.on('connection', function(socket) {
			//console.log("Connected " +socket.client.request.decoded_token.username);
			//console.log(socket.decoded_token);
			socketEvents(socket);
		});
		server.listen(serverConfig.port, function() {
			done();
		});
	},
	closeServer: function() {
		if (server) server.close();
	},
	generateToken: function(usr, secret) {
		if (!secret) secret = serverConfig.secret;
		return jwt.sign({
			id: usr.id,
			username: usr.username
		}, secret, {
			expiresIn: 3600
		});
	}
};