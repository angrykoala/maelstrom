var bodyParser = require('body-parser');

module.exports = {
	port: process.env.PORT || 8080,
	secret: "dontpanic42",
	tokenExpire: 3600,
	setup: function(app) {
		app.use(bodyParser.json()); // get information from body
		app.use(bodyParser.urlencoded({
			extended: true
		}));

	}
};