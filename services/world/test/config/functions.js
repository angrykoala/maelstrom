var mongoose = require('mongoose');

var City = require('../../app/models/city.js');
var Product = require('../../app/models/product.js');
var User = require('../../app/models/user.js');
var Ship = require('../../app/models/ship.js');


var Config = require('./server.js');

var dbConfig = require('../../config/database.js');

var assert = require('chai').assert;

var server;
//auxiliary functions for testing
module.exports = {
	clearDB: function(done) { //mini callback hell
		User.remove({}, function(err, res) {
			if (err) done(err);
			else Product.remove({}, function(err, res) {
				if (err) done(err);
				else Ship.remove({}, function(err, res) {
					if (err) done(err);
					else City.remove({}, function(err, res) {
						if (err) done(err);
						else done();
					});
				});
			});
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
	}
}