/*
Name: Routes
Project: Mäelstrom - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: API REST for login and signup
*/

var dbHandler = require('./dbhandler');
var path = require('path');
var rootPath={ root: path.join(__dirname, '../views') }

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.end("Maelstrom Users");
	});
	app.get('/login', function(req, res) {
		res.sendFile('login.html',rootPath);

	});
	app.post('/login', function(req, res) {
		dbHandler.findUser(req.body.username, function(err, usr) {
			if (err) res.end(err.toString());
			else if (!usr) res.end("User not found");
			else {
				usr.validPassword(req.body.password,function(err,isValid){
					if(err) res.end(err.toString());
					else if(isValid) res.json(usr);
					else res.end("Incorrect password");	
				});
			}
		});
	});
	app.get('/signup', function(req, res) {
		res.sendFile('./signup.html',rootPath);
	});
	app.post('/signup', function(req, res) {
		var info = {
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		};
			dbHandler.saveUser(info, function(err, usr) {
				if (err) res.end(err.toString());
				else res.json(usr);
			});
	});
	app.post('/logout', function(req, res) {


	});


};
