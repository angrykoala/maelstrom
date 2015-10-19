/*
Name: Users Service
Project: Mäelstrom - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Users microsevice for maelstrom using mongoose and JWT
*/


var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
	
var serverConfig=require('./config/server.js');
var dbConfig = require('./config/database.js');
var dbHandler = require('./app/dbhandler');

require('./app/routes.js')(app);

app.use(bodyParser.json()); // get information from body
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static(__dirname + '/public'));

mongoose.connect(dbConfig.url);

var db = mongoose.connection;
db.on('error', function(err) {
	console.error('DB connection error:' + err);
});

db.once('open', function() {
	console.log("Database opened");
	//Starts server once database has opened
	app.listen(serverConfig.port, function() {
		console.log("Server listening on port " + serverConfig.port);
	});

});
