var mongoose = require('mongoose');

var User = require('../../app/models/user.js');
var Config = require('./server.js');


var express = require('express');
var bodyParser = require('body-parser');

var bcrypt = require('bcrypt-nodejs');
var dbConfig = require('../../config/database.js');

var server;
//auxiliary functions for testing
module.exports = {
	clearUsers: function(done) {
		User.remove({}, function(err, res) {
			if (err) done(err);
			else done();
		});
	},
	connectDB: function(done) {
		mongoose.connect(Config.dbUrl);
		var db = mongoose.connection;
		/*db.on('error', function(err) {
			done(err);
		});*/
		db.once('open', function() {
			done();
		});
		return db;
	},
	setupServer: function(done) {
		var app = express();
		require('../../app/routes.js')(app);
		server = app.listen(Config.serverPort, function() {
			done();
		});
		return app;
	},
	closeServer: function() {
		if (server) server.close();
	},
	checkPassword: function(password, hash) {
		if (!dbConfig.regexp.password.test(password)) return false;
		else return bcrypt.compareSync(password, hash);
	}
}
