var mongoose = require('mongoose');

var City = require('../../app/models/city.js');
var Product = require('../../app/models/product.js');
var User = require('../../app/models/user.js');
var Ship = require('../../app/models/ship.js');

var data = require('./data.js');


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
	},
	//loads product ids in cities
	setCityProducts: function(done) {
		Product.find({}, function(err, res) {
			assert.notOk(err);
			var productIds = {};
			for (var i = 0; i < res.length; i++) productIds[res[i].name] = res[i].id;
			for (var key in data.cities) {
				var cityData = data.cities[key];
				for (var i = 0; i < cityData.products.length; i++) {
					cityData.products[i]["id"] = productIds[cityData.products[i].name];
					//	assert.ok(cityData.products[i].id);
				}
			}
			done();
		});
	}
}