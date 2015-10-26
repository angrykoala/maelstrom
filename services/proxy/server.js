/*
Name: Proxy Service
Project: Mäelstrom - Proxy
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Socket.io (websocket) interface between clients and back-end
*/


var http = require('http');
var express = require('express');
var app = express();
var server=http.createServer(app);

var io = require('socket.io')(server); //socket io listening to server
var serverConfig = require('./config/server.js');


server.listen(serverConfig.port, function() {
    console.log("Server listening on port " + serverConfig.port);
});
