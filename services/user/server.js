/*
Name: User Service
Project: Mäelstrom
Version: 0.0.1
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Users microsevice for maelstrom using mongoose
*/

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



	var express = require('express');
	var app = express();
	var port = process.env.PORT || 8080;

	var bodyParser = require('body-parser');
	app.use(bodyParser()); // get information from body

	require('./app/routes.js')(app);

	app.listen(port, function() {
		console.log("Server listening on port " + port);
	});

});