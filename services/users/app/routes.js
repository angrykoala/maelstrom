/*
Name: Routes
Project: Maelström - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: API REST for login and signup
*/

var dbHandler = require('./dbhandler');
var path = require('path');
var rootPath = {
	root: path.join(__dirname, '../views')
}

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.send("Maelstrom Users");
	});
	app.get('/login', function(req, res) {
		res.sendFile('login.html', rootPath);

	});
	app.post('/login', function(req, res) {
		dbHandler.findUser(req.body.username, function(err, usr) {
			if (err) {
				//console.error("POST /login: " + err);
				res.status(500).json({
					error: err.toString()
				});
			} else if (!usr) res.status(404).json({
				error: "User not found"
			});
			else {
				usr.validPassword(req.body.password, function(err, isValid) {
					if (err) {
						//console.error("POST /login: " + err);
						res.status(500).json({
							error: err.toString()
						});
					} else if (isValid) res.json(usr); //TODO: send token
					else res.status(403).json({
						error: "Incorrect password"
					});
				});
			}
		});
	});
	app.get('/signup', function(req, res) {
		res.sendFile('./signup.html', rootPath);
	});
	app.post('/signup', function(req, res) {
		if (!req.body) res.status(400).json({
			error: "empty forms"
		});
		else {
			var info = {
				username: req.body["username"],
				password: req.body["password"],
				email: req.body["email"]
			};
			if (!info.username || !info.password || !info.email) res.status(400).json({
				error: "empty forms"
			});
			else dbHandler.saveUser(info, function(err, usr) {
				if (err) {
					//console.log("POST /signup"+err);
					res.status(500).json({
						error: err.toString()
					});
				} else res.status(201).json(usr);
			});
		}
	});
	/*	app.post('/logout', function(req, res) {

		});*/


};