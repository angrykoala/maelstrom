/*
Name: Proxy Service
Project: Mäelstrom - Proxy
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Socket.io (websocket) interface between clients and back-end
*/


var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var serverConfig = require('./config/server.js');

var version = process.env.npm_package_version;

var io = require('socket.io')(server); //socket io listening to server
var socketjwt = require('socketio-jwt');
var socketEvents=require('./app/events.js');

io.set('authorization',socketjwt.authorize({
	secret: serverConfig.sercret,
	handshake: true
}));

io.on('connection', function(socket) {
	console.log("new connection by "+socket.handshake.decoded_token.username);
	socketEvents(socket);
});

server.listen(serverConfig.port, function() {
	console.log("Maelström - Proxy");
	if (version) console.log("Version " + version);
	console.log("Server listening on port " + serverConfig.port);
});
