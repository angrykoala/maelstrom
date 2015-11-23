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
				assert.isDefined(res[i].positionY);
				assert.isDefined(res[i].positionX);
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
			assert.isDefined(res[0].id);
			assert.isDefined(res[0].userId);
			assert.strictEqual(res[0].userId, user.id);
			done();
		});
	});
	it('Get Ship Products', function(done) {
		var userId = data.users.arthur.id;
		Get.ships(userId, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var shipId = res[0].id;
			Get.shipProducts(shipId, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.ok(res[0]);
				assert.isDefined(res[0].shipId);
				assert.strictEqual(res[0].shipId, shipId);
				assert.ok(res[0].productId);
				assert.ok(res[0].quantity);
				Get.shipProducts(44, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.strictEqual(res.length, 0);
					done();
				});
			});
		});
	});
	it('Get Ship Models', function(done) {
		Get.shipModels(function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.ok(res[0]);
			assert.ok(res[0].id);
			assert.ok(res[0].name);
			done();
		});
	});
	it('Get Products', function(done) {
		Get.productList(function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.ok(res[0]);
			var prod = res[0];
			Get.productDetails(prod.id, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.strictEqual(res.id, prod.id);
				assert.strictEqual(res.name, prod.name);
				Get.productDetails(44, function(err, res) {
					assert.ok(err);
					assert.notOk(res);
					done();
				});
			});
		});
	});
	it('Get Distance', function(done) {
		Get.map(function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.ok(res[0]);
			assert.ok(res[1]);
			Get.distance(res[0].id, res[1].id, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.closeTo(res, 300.3747659175, 0.000001);

				done();
			});
		});
	});
	it.skip('Get Remaining Time', function(done) {
		done(new Error("Not implemented"));
	});

	it.skip('Get Price', function(done) {
		done(new Error("Not implemented"));

	});
});