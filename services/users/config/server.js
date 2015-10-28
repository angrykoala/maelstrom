//Users server configuration

var bodyParser = require('body-parser');

module.exports = {
	port: process.env.PORT || 8080, //server port
	secret: "dontpanic42", //secret
	tokenExpire: 3600, //token expiration time (in seconds)
	//setups basic server (sets bodyparser)
	setup: function(app) {
		app.use(bodyParser.json()); // get information from body
		app.use(bodyParser.urlencoded({
			extended: true
		}));

	}
};