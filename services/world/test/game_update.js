/*
Name: Game Update - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for game update logic
*/


var assert = require('chai').assert;
var async = require('async');

var data = require('./config/data.js');
var dbHandler = require('../app/dbhandler.js');
var tables = dbHandler.tables;
var auxFunc = require('./config/functions.js');

var Get = require("../app/get_actions.js");
var Actions = require("../app/user_actions.js");

var gameUpdate = require('../app/game_update.js');

describe('Game Update Logic', function() {
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
			auxFunc.populate(done);
		});
	});
	after(function(done) {
		dbHandler.clearTables(function(err) {
			assert.notOk(err);
			done();
		});
	});
	it("Product Update", function(done) {
		dbHandler.runQuery("SELECT * FROM " + tables.cityProducts, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var prodId = res[0].productId;
			var quantity = res[0].quantity;
			dbHandler.get.byId(tables.products, prodId, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				var prod = res[0].baseProduction;
				var cons = res[0].baseConsumption;
				assert.ok(prod);
				assert.ok(cons);
				gameUpdate.cityProductsUpdate(function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					dbHandler.runQuery("SELECT * FROM " + tables.cityProducts, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.closeTo(res[0].quantity, quantity + prod - cons, 0.5);
						done();
					});
				});
			});
		});
	});
	it("Ship Update", function(done) {
		dbHandler.get.all(tables.userShips, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.ok(res[0]);
			assert.ok(res[1]);
			assert.strictEqual(res[0].status, "docked");
			var userId = res[0].userId;
			var shipId = res[0].id;
			var cityId = res[0].city;
			var shipId2 = res[1].id;
			var ship2city = res[1].city;
			dbHandler.get.all(tables.cities, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.ok(res[0]);
				assert.ok(res[1]);
				var cityId2 = res[1].id;
				if (cityId === cityId2) cityId2 = res[0].id;
				Actions.moveShip(userId, shipId, cityId2, function(err, res) {
					assert.notOk(err);
					assert.ok(res);

					Get.shipDetails(shipId, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.strictEqual(res.city, cityId);
						assert.strictEqual(res.destiny, cityId2);
						assert.strictEqual(res.status, "sailing");
						assert.ok(res.remaining);
						var remaining1 = res.remaining;
						gameUpdate.shipsUpdate(function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							Get.shipDetails(shipId, function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.city, cityId);
								assert.strictEqual(res.destiny, cityId2);
								assert.strictEqual(res.status, "sailing");
								assert.strictEqual(res.remaining, remaining1 - 1);

								dbHandler.runQuery("UPDATE " + tables.userShips + " SET remaining=1 WHERE id=" + shipId, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									Get.shipDetails(shipId, function(err, res) {
										assert.notOk(err);
										assert.ok(res);
										assert.strictEqual(res.city, cityId);
										assert.strictEqual(res.destiny, cityId2);
										assert.strictEqual(res.status, "sailing");
										assert.strictEqual(res.remaining, 1);
										gameUpdate.shipsUpdate(function(err, res) {
											assert.notOk(err);
											assert.ok(res);
											Get.shipDetails(shipId, function(err, res) {
												assert.notOk(err);
												assert.ok(res);
												assert.strictEqual(res.status, "docked");
												assert.strictEqual(res.city, cityId2);
												assert.strictEqual(res.remaining, 0);
												Get.shipDetails(shipId2, function(err, res) {
													assert.notOk(err);
													assert.ok(res);
													assert.strictEqual(res.status, "docked");
													assert.strictEqual(res.city, ship2city);
													done();
												});
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});




});