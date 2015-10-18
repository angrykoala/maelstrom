/*
Name: Users Service
Project: Mäelstrom - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Users microsevice for maelstrom using mongoose and JWT
*/


var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser()); // get information from body
require('./app/routes.js')(app);

var dbHandler = require('./app/dbhandler');
//MongoDB
var mongoose = require('mongoose');
var dbConfig = require('./config/database.js');
mongoose.connect(dbConfig.url);

var db = mongoose.connection;
db.on('error', function(err) {
	console.error('DB connection error:' + err);
});


db.once('open', function() {
	console.log("database opened");

	app.listen(port, function() {
		console.log("Server listening on port " + port);
	});

});