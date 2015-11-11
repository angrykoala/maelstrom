/*
Name: GET Actions - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for get actions
*/

var assert = require('chai').assert;
var async = require('async');
var mongoose = require('mongoose');

var auxFunc = require('./config/functions.js');
var data = require('./config/data.js');
var regexp = require('../config/database.js').regexp;

var Get = require('../app/get_actions.js');
var Models = require('../app/dbhandler.js').models;

describe('Get Actions', function() {
	this.timeout(2000);
	var db;
	before(function(done) {
		db = auxFunc.connectDB(function(err) {
			assert.notOk(err);
			auxFunc.clearDB(function(err) {
				assert.notOk(err);
				auxFunc.insertAllData(function(err) {
					assert.notOk(err);
					done();
				});
			});
		});
	});
	after(function(done) {
		auxFunc.clearDB(function(err) {
			assert.notOk(err);
			db.close(done);
		});
	});
	it('Get Map', function(done) {
		var correctData = auxFunc.getCorrectData(data.cities);
		Get.map(function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.strictEqual(correctData.length, res.length);
			for (var i = 0; i < res.length; i++) {
				assert.ok(res[i].id);
				assert.ok(res[i]._id);
				assert.ok(res[i].name);
				assert.match(res[i].name, regexp.cityName);
				assert.isNumber(res[i].position_x);
				assert.isNumber(res[i].position_y);
			}
			done();
		});
	});
	it('Get City Details', function(done) {
		var correctData = auxFunc.getCorrectData(data.cities);
		Get.map(function(err, res) {
			assert.notOk(err);
			assert.strictEqual(res.length, correctData.length);
			async.each(res, function(city, callback) {
				Get.cityDetails(city.id, function(err, res) {
					assert.notOk(err);
					assert.ok(res.id);
					assert.ok(res.name);
					assert.match(res.name, regexp.cityName);
					assert.isNumber(res.position_y);
					assert.isNumber(res.position_x);
					assert.ok(res.products);
					for (var i = 0; i < res.products; i++) {
						assert.ok(res.products[i]);
						assert.isNumber(res.products[i].quantity);
						assert.isNumber(res.products[i].consume);
						assert.isNumber(res.products[i].production);
					}
					callback();
				});
			}, function(err) {
				assert.notOk(err);
				Get.cityDetails(mongoose.Types.ObjectId(), function(err, res) {
					assert.notOk(err);
					assert.notOk(res);
					done();
				});
			});
		});
	});
	it('Get User Data', function(done) {
		var correctData = auxFunc.getCorrectData(data.users);
		async.each(correctData, function(usr, callback) {
			Get.userData(usr._id, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.isNumber(res.money);
				//assert.ok(res.id); //maybe will remove id from result
				callback();
			});
		}, function(err, res) {
			assert.notOk(err);
			Get.userData(mongoose.Types.ObjectId(), function(err, res) {
				assert.notOk(err);
				assert.notOk(res);
				done();
			});
		});
	});
	it('Get User Ships', function(done) {
		var correctData = auxFunc.getCorrectData(data.users);
		async.each(correctData, function(usr, callback) {
			Get.ships(usr._id, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				async.each(res, function(ship, callback2) {
					assert.ok(ship._id);
					assert.match(ship.name, regexp.shipName);
					assert.isNumber(ship.life);
					assert.ok(ship.status);
					assert.ok(ship.model);
					assert.ok(ship.travelStatus);
					Get.shipDetails(usr._id, ship._id, function(err, res) {
						assert.notOk(err);
						assert.ok(res._id);
						assert.match(res.name, regexp.shipName);
						assert.isNumber(res.life);
						assert.ok(res.status);
						assert.ok(res.model);
						assert.ok(res.travelStatus);
						assert.ok(res.products);
						for (var i = 0; i < res.products.length; i++) {
							assert.ok(res.products[i].id);
							assert.isNumber(res.products[i].quantity);
						}
						callback2();
					});
				}, function(err) {
					assert.notOk(err);
					callback();
				});
			});
		}, function(err, res) {
			assert.notOk(err);
			Get.ships(mongoose.Types.ObjectId(), function(err, res) {
				assert.notOk(err);
				assert.notOk(res);
				Get.shipDetails(mongoose.Types.ObjectId(), mongoose.Types.ObjectId(), function(err, res) {
					assert.notOk(err);
					assert.notOk(res);
					Get.shipDetails(correctData[0], mongoose.Types.ObjectId(), function(err, res) {
						assert.notOk(err);
						assert.notOk(res);
						done();
					});
				});
			});
		});

	});
	it('Get Ship Models', function(done) {
		var correctData = auxFunc.getCorrectData(data.ships);
		Get.shipModels(function(err, res) {
			assert.notOk(err);
			assert.strictEqual(res.length, correctData.length);
			for (var i = 0; i < res.length; i++) {
				assert.ok(res[i].id);
				assert.match(res[i].name, regexp.shipTypeName);
				assert.isNumber(res[i].cargo);
				assert.isNumber(res[i].life);
				assert.isNumber(res[i].speed);
				assert.isNumber(res[i].price);
			}
			done();
		});
	});
	it('Get Products', function(done) {
		var correctData = auxFunc.getCorrectData(data.products);
		Get.productList(function(err, res) {
			assert.notOk(err);
			assert.strictEqual(res.length, correctData.length);
			async.each(res, function(product, callback) {
				assert.ok(product);
				assert.ok(product.id);
				assert.match(product.name, regexp.productName);
				assert.isNumber(product.weight);
				Get.productDetails(product.id, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.strictEqual(res.id, product.id);
					assert.strictEqual(res.name, product.name);
					callback();
				});
			}, function(err) {
				assert.notOk(err);
				Get.productDetails(mongoose.Types.ObjectId(), function(err, res) {
					assert.notOk(err);
					assert.notOk(res);
					done();
				});
			});
		});
	});
	it('Get Remaining Time', function(done) {
		var userId = data.users.travelingCaptain._id;
		Models.User.findOne({
			_id: userId
		}, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var shipId = res.ships[0];
			Get.remainingTime(userId, shipId, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.strictEqual(res, 10);
				Get.remainingTime(mongoose.Types.ObjectId(), shipId, function(err, res) {
					assert.ok(err);
					assert.notOk(res);
					Get.remainingTime(userId, mongoose.Types.ObjectId(), function(err, res) {
						assert.ok(err);
						assert.notOk(res);
						userId = data.users.arthur._id;
						Models.User.findOne({
							_id: userId
						}, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							var shipId = res.ships[0];
							//A docked ship
							Get.remainingTime(userId, shipId, function(err, res) {
								assert.ok(err);
								assert.notOk(res);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('Get Distance', function(done) {
		Models.City.find({}, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert(res.length >= 2);
			cityId1 = res[0]._id;
			cityId2 = res[1]._id;
			Get.distance(cityId1, cityId2, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.closeTo(res, 299.8753, 0.0001); //values (10,40) and (-5,-259.5)
				Get.distance(cityId1, cityId1, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res, 0.0);
					Get.distance(mongoose.Types.ObjectId(), cityId1, function(err, res) {
						assert.ok(err);
						assert.notOk(res);
						Get.distance(cityId1, mongoose.Types.ObjectId(), function(err, res) {
							assert.ok(err);
							assert.notOk(res);
							Get.distance(mongoose.Types.ObjectId(), mongoose.Types.ObjectId(), function(err, res) {
								assert.ok(err);
								assert.notOk(res);
								done();
							});
						});
					});
				});
			});
		});
	});
});
