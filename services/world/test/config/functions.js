var mongoose = require('mongoose');
var async = require('async');

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
	getCorrectData: function(dataObject) {
		var res = [];
		var keys = Object.keys(dataObject);
		for (var i = 0; i < keys.length; i++) {
			if (dataObject.hasOwnProperty(keys[i])) {
				if (dataObject[keys[i]].correct) {
					res.push(dataObject[keys[i]]);
				}
			}
		}
		return res;
	},
	insertAllData: function(done) {
		async.series([
			function(callback) {
				insertAll(User, data.users, callback);
			},
			function(callback) {
				insertAll(Product, data.products, callback);
			},
			function(callback) {
				insertAll(Ship, data.ships, callback);
			},
			function(callback) {
				insertAll(City, data.cities, callback);
			}
		], function(err, res) {
			assert.notOk(err);
			done();
		});
	}
};

function insertAll(Model, dataObject, done) {
	async.each(Object.keys(dataObject), function(key, callback) {
		if (dataObject.hasOwnProperty(key)) {
			if (dataObject[key].correct) {
				var newData = new Model(dataObject[key]);
				assert.ok(newData);
				newData.save(function(err, res) {
					assert.notOk(err);
					callback();
				});
			} else callback();
		}
	}, function(err) {
		assert.notOk(err);
		done();
	});
}