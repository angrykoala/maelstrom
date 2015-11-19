/*
Name: Models - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for world models
*/
/*
var assert = require('chai').assert;
var async = require('async');
var mongoose = require('mongoose');

var auxFunc = require('./config/functions.js');

var City = require('../app/models/city.js');
var Product = require('../app/models/product.js');
var User = require('../app/models/user.js');
var Ship = require('../app/models/ship.js');
var UserShip = mongoose.model('user_ship_test', require('../app/models/user_ship.js'));

var testData = require('./config/data.js');

describe.('Models', function() {
	this.timeout(2000);
	var db;
	before(function(done) {
		db = auxFunc.connectDB(function(err) {
			assert.notOk(err);
			auxFunc.clearDB(function(err) {
				assert.notOk(err);
				done();
			});
		});
		beforeEach(function(done) {
			auxFunc.clearDB(function(err) {
				assert.notOk(err);
				done();
			});
		});
	});
	after(function(done) {
		auxFunc.clearDB(function(err) {
			assert.notOk(err);
			UserShip.remove({}, function(err) {
				assert.notOk(err);
				db.close(done);
			});
		});
	});
	it('Ship model', function(done) {
		var testShip = new Ship(testData.ships.galleon);
		assert.ok(testShip);
		assert.equal(testShip.name, testData.ships.galleon.name);
		testShip.save(function(err, res) {
			assert.notOk(err);
			Ship.find({}, function(err, res) {
				assert.notOk(err);
				assert.strictEqual(res.length, 1);
				assert.equal(res[0].name, testData.ships.galleon.name);

				var correctElements = 0;
				async.each(Object.keys(testData.ships), function(key, callback) {
						if (testData.ships.hasOwnProperty(key)) {
							if (testData.ships[key].correct === true) correctElements++;
							var newship = new Ship(testData.ships[key]);
							assert.ok(newship);
							newship.save(function() {
								callback();
							});
						}
					},
					function(err) {
						assert.notOk(err);
						Ship.find({}, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res.length, correctElements);
							done();
						});
					});
			});
		});
	});
	it('Product model', function(done) {
		var testProduct = new Product(testData.products.bread);
		assert.ok(testProduct);
		assert.equal(testProduct.name, testData.products.bread.name);
		testProduct.save(function(err) {
			assert.notOk(err);

			Product.find({}, function(err, res) {
				assert.notOk(err);
				assert.strictEqual(res.length, 1);
				assert.equal(res[0].name, testData.products.bread.name);

				var correctElements = 0;
				async.each(Object.keys(testData.products), function(key, callback) {
					if (testData.products.hasOwnProperty(key)) {
						if (testData.products[key].correct === true) correctElements++;
						var newproduct = new Product(testData.products[key]);
						assert.ok(newproduct);
						newproduct.save(function() {
							callback();
						});
					}
				}, function(err) {
					assert.notOk(err);
					Product.find({}, function(err, res) {
						assert.notOk(err);
						assert.strictEqual(res.length, correctElements);
						done();
					});
				});
			});
		});
	});
	it('City model', function(done) {
		var testCity = new City(testData.cities.minasTirith);
		assert.ok(testCity);
		testCity.save(function(err, res) {
			assert.notOk(err);
			assert.strictEqual(res.name, testData.cities.minasTirith.name);
			assert.strictEqual(res.products.length, 2);

			var correctElements = 0;
			async.each(Object.keys(testData.cities), function(key, callback) {
				if (testData.cities.hasOwnProperty(key)) {
					if (testData.cities[key].correct === true) correctElements++;
					var newcity = new City(testData.cities[key]);
					assert.ok(newcity);
					newcity.save(function(err) {
						callback();
					});
				}
			}, function(err) {
				assert.notOk(err);
				City.find({}, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res.length, correctElements);
					done();
				});
			});
		});
	});
	it('User ship schema', function(done) {
		var testUserShip = new UserShip(testData.userShips.blackPearl);
		assert.ok(testUserShip);
		assert.equal(testUserShip.name, testData.userShips.blackPearl.name);
		testUserShip.save(function(err, res) {
			assert.notOk(err);
			assert.ok(res.id);
			assert.equal(res.name, testData.userShips.blackPearl.name);
			UserShip.find({}, function(err, res) {
				assert.notOk(err);
				assert.strictEqual(res.length, 1);
				assert.equal(res[0].name, testData.userShips.blackPearl.name);

				var correctElements = 1;
				async.each(Object.keys(testData.userShips), function(key, callback) {
					if (testData.userShips.hasOwnProperty(key)) {
						if (testData.userShips[key].correct === true) correctElements++;
						var newUserShip = new UserShip(testData.userShips[key]);
						assert.ok(newUserShip);
						newUserShip.save(function(err, res) {
							callback();
						});
					}
				}, function(err) {
					assert.notOk(err);
					UserShip.find({}, function(err, res) {
						assert.notOk(err);
						assert.strictEqual(res.length, correctElements);
						done();
					});
				});
			});
		});
	});
	it('User model', function(done) {
		var testUser = new User(testData.users.arthur);
		var testUser2 = new User(testData.users.ford);

		assert.ok(testUser);
		assert.equal(testUser._id, testData.users.arthur._id);
		testUser.save(function(err, res) {
			assert.notOk(err);
			assert.equal(res.id, testData.users.arthur._id);
			assert.strictEqual(res.ships.length, 1);
			User.find({}, function(err, res) {
				assert.notOk(err);
				assert.strictEqual(res.length, 1);
				assert.equal(res[0].id, testData.users.arthur._id);


				var correctElements = 0; //2 black pearls
				async.each(Object.keys(testData.users), function(key, callback) {
					if (testData.users.hasOwnProperty(key)) {
						if (testData.users[key].correct === true) correctElements++;
						var newUser = new User(testData.users[key]);
						assert.ok(newUser);
						newUser.save(function(err, res) {
							callback();
						});
					}
				}, function(err) {
					assert.notOk(err);
					User.find({}, function(err, res) {
						assert.notOk(err);
						assert.strictEqual(res.length, correctElements);
						done();
					});
				});
			});
		});
	});
});*/