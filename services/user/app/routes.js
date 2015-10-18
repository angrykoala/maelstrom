/*
Name:
Version:
Author:
Description:
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
		console.log("login");
		User.find({
			username: req.body.username
		}, function(err, result) {
			if (err) return console.error(err);
			res.json(result);
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

		if (info.name && info.mail && info.pass) {
			dbHandler.saveUser(info, function() {


			});
		}
	});
	app.post('/logout', function(req, res) {


	});


};