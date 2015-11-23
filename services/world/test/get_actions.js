/*
Name: GET Actions - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for get actions
*/

var assert = require('chai').assert;
var async = require('async');

var data = require('./config/data.js');
var dbHandler = require('../app/dbhandler.js');
var tables = dbHandler.tables;
var auxFunc = require('./config/functions.js');

var Get = require('../app/get_actions.js');

describe('Get Actions', function() {
	this.timeout(4000);
	before(function(done) {
		this.timeout(20000);
		dbHandler.dropTables(function(err, res) {
			assert.notOk(err);
			dbHandler.createTables(function(err, res) {
				assert.notOk(err);
				done();
			});
		});
	});
	beforeEach(function(done) {
		dbHandler.clearTables(function(err) {
			assert.notOk(err);
			auxFunc.insertData(done);
		});
	});
	after(function(done) {
		dbHandler.clearTables(function(err) {
			assert.notOk(err);
			done();
		});
	});
	it('Get Map', function(done) {
		Get.map(function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.strictEqual(res.length, 2);
			for (var i = 0; i < res.length; i++) {
				assert.isDefined(res[i].id);
				assert.ok(res[i].name);
				assert.isDefined(res[i].position_y);
				assert.isDefined(res[i].position_x);
			}
			done();
		});
	});
	it('Get City Details', function(done) {
		Get.map(function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var cities = res;
			Get.cityDetails(cities[0].id, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.ok(res.products);
				Get.cityDetails(44, function(err, res) {
					assert.ok(err);
					assert.notOk(res);
					done();
				});
			});
		});
	});
	it('Get City Products', function(done) {
		Get.map(function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var cities = res;
			Get.cityProducts(cities[0].id, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				done();
			});
		});
	});
	it('Get User Data', function(done) {
		var user = data.users.arthur;
		Get.userData(user.id, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.strictEqual(res.money, user.money);
			Get.userData(44, function(err, res) {
				assert.ok(err);
				assert.notOk(res);
				done();
			});
		});
	});
	it('Get User Ships', function(done) {
		var user = data.users.arthur;
		Get.ships(user.id, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.ok(res[0].id);
			assert.strictEqual(res[0].user_id, user.id);
			done();
		});
	});
	it.skip('Get Ship Models', function(done) {
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
	it.skip('Get Products', function(done) {
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
	it.skip('Get Remaining Time', function(done) {
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
	it.skip('Get Distance', function(done) {
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
	it.skip('Get Price', function(done) {
		done(new Error("Not implemented"));

	});
});