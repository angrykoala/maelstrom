module.exports = function(app,passport) {
	app.get('/', function(req, res) {
		res.end("Maelstrom Users");
	});
	app.get('/login', function(req, res) {
		res.sendfile('./views/login.html');

	});
	app.post('/login', passport.authenticate('local-login'),function(req,res) {
		console.log("correct login");
	}));
	app.get('/signup', function(req, res) {


	});
	app.post('/signup', function(req, res) {


	});
	app.post('/logout', function(req, res) {


	});


};
