/*
Name: Routes
Project: Mäelstrom - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: API REST for login and signup
*/

var dbHandler = require('./dbhandler');

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.end("Maelstrom Users");
	});
	app.get('/login', function(req, res) {
		res.sendfile('./views/login.html');

	});
	app.post('/login', function(req, res) {
		dbHandler.findUser(req.body.username, function(err, usr) {
			if (err) res.end(err);
			else if (!usr) res.end("User not found");
			else {
				if (usr.validPassword(req.body.password)) res.json(usr);
				else res.end("Password not valid");
			}
		});
	});
	app.get('/signup', function(req, res) {
		res.sendfile('./views/signup.html');
	});
	app.post('/signup', function(req, res) {
		var info = {
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		};

		if (!info.name && !info.mail && !info.pass) {
			dbHandler.saveUser(info, function(err, usr) {
				if (err) res.end(err.toString());
				else res.json(usr);
			});
		} else res.end("Not info provided");
	});
	app.post('/logout', function(req, res) {


	});


};
