var mongoose = require('mongoose');

var User = require('../../app/models/user.js');
var Config = require('./server.js');


var express = require('express');
var bodyParser = require('body-parser');

var bcrypt = require('bcrypt-nodejs');
var dbConfig = require('../../config/database.js');

var jwt = require('jsonwebtoken');
var assert = require('chai').assert;

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
	},
	checkToken: function(token, usr) {
		var decoded = jwt.decode(token);
		assert.property(decoded, "id");
		assert.property(decoded, "username");
		if (usr.id) assert.strictEqual(decoded.id, usr.id);
		assert.strictEqual(decoded.username, usr.username);
	}
};