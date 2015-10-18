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
		var name = req.body.username;
		var mail = req.body.email;
		var pass = req.body.password;
		if (name != undefined && mail != undefined && pass != undefined) {
			User.findOne({
					$or: [{
						"username": name
					}, {
						"email": mail
					}]
				},
				function(err, user) {
					if (err) console.log(err);
					else if (!user) {
						var newUser = new User({
							username: name,
							email: mail
						});
						newUser.password = newUser.generateHash(pass);
						newUser.save();
						res.end("user saved correctly");
					} else res.end("User already exists");
				});
		}
	});
	app.post('/logout', function(req, res) {


	});


};