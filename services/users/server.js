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
app.use(bodyParser.json()); // get information from body
app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.static(__dirname + '/public'));

require('./app/routes.js')(app);

var mongoose = require('mongoose');
var dbConfig = require('./config/database.js');
var dbHandler = require('./app/dbhandler');
mongoose.connect(dbConfig.url);

var db = mongoose.connection;
db.on('error', function(err) {
	console.error('DB connection error:' + err);
});

db.once('open', function() {
	console.log("database opened");
	//Starts server once database has opened
	app.listen(port, function() {
		console.log("Server listening on port " + port);
	});

});
