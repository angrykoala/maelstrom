/*
Name: User Service
Project: Mäelstrom
Version: 0.0.1
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Users microsevice for maelstrom using mongoose
*/

var dbHandler = require('./app/dbhandler');


var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser()); // get information from body

//require('./app/routes.js')(app);

app.listen(port, function() {
	console.log("Server listening on port " + port);
});

dbHandler.saveUser({
	username: "pepe3",
	password: "wasabiwasabi",
	email: "mymail2"
}, function(err, res) {
	console.log(err);
	console.log(res);
	
});
