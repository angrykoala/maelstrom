var User = require('./models/user');

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


	});
	app.post('/signup', function(req, res) {

		newUser.local.password = newUser.generateHash(password);
	});
	app.post('/logout', function(req, res) {


	});


};