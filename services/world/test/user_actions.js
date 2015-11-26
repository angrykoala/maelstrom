/*
Name: User  Actions - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for actions
*/

var assert = require('chai').assert;
var async = require('async');

var auxFunc = require('./config/functions.js');
var data = require('./config/data.js');

var Actions = require('../app/user_actions.js');
var dbHandler = require('../app/dbhandler.js');
var tables = dbHandler.tables;


describe('User Actions', function() {
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

	it.skip("Move Ship", function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it("Buy Product", function(done) {
		var userId = data.users.arthur.id;
		dbHandler.get.user(userId, function(err, res) {
			assert.notOk(err);
			assert.ok(res[0]);
			var userMoney = res[0].money;
			dbHandler.get.all(tables.products, function(err, res) {
				assert.notOk(err);
				assert.ok(res[0]);
				var productId = res[0].id;
				var productPrice = res[0].basePrice;
				dbHandler.get.all(tables.cities, function(err, res) {
					assert.notOk(err);
					assert.ok(res[0]);
					var cityId = res[0].id;
					dbHandler.get.userShips(userId, function(err, res) {
						assert.notOk(err);
						assert.ok(res[0]);
						var shipId = res[0].id;
						dbHandler.get.shipProduct(shipId, productId, function(err, res) {
							assert.notOk(err);
							assert.ok(res[0]);
							var shipProd = res[0].quantity;
							assert.strictEqual(res[0].productId, productId);
							dbHandler.get.cityProduct(cityId, productId, function(err, res) {
								assert.notOk(err);
								assert.ok(res[0]);
								var cityProd = res[0].quantity;
								assert.strictEqual(res[0].productId, productId);
								Actions.buyProduct(userId, shipId, cityId, productId, 2, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									dbHandler.get.shipProduct(shipId, productId, function(err, res) {
										assert.notOk(err);
										assert.ok(res[0]);
										assert.strictEqual(res[0].quantity, shipProd + 2);
										dbHandler.get.cityProduct(cityId, productId, function(err, res) {
											assert.notOk(err);
											assert.ok(res[0]);
											assert.strictEqual(res[0].quantity, cityProd - 2);
											dbHandler.get.user(userId, function(err, res) {
												assert.notOk(err);
												assert.ok(res[0]);
												assert.strictEqual(res[0].money,userMoney - (productPrice * 2));
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
	it("Sell Product", function(done) {
		var userId = data.users.arthur.id;
		dbHandler.get.user(userId, function(err, res) {
			assert.notOk(err);
			assert.ok(res[0]);
			var userMoney = res[0].money;
			dbHandler.get.all(tables.products, function(err, res) {
				assert.notOk(err);
				assert.ok(res[0]);
				var productId = res[0].id;
				var productPrice = res[0].basePrice;
				dbHandler.get.all(tables.cities, function(err, res) {
					assert.notOk(err);
					assert.ok(res[0]);
					var cityId = res[0].id;
					dbHandler.get.userShips(userId, function(err, res) {
						assert.notOk(err);
						assert.ok(res[0]);
						var shipId = res[0].id;
						dbHandler.get.shipProduct(shipId, productId, function(err, res) {
							assert.notOk(err);
							assert.ok(res[0]);
							var shipProd = res[0].quantity;
							assert.strictEqual(res[0].productId, productId);
							dbHandler.get.cityProduct(cityId, productId, function(err, res) {
								assert.notOk(err);
								assert.ok(res[0]);
								var cityProd = res[0].quantity;
								assert.strictEqual(res[0].productId, productId);
								Actions.sellProduct(userId, shipId, cityId, productId, 2, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									dbHandler.get.shipProduct(shipId, productId, function(err, res) {
										assert.notOk(err);
										assert.ok(res[0]);
										assert.strictEqual(res[0].quantity, shipProd - 2);
										dbHandler.get.cityProduct(cityId, productId, function(err, res) {
											assert.notOk(err);
											assert.ok(res[0]);
											assert.strictEqual(res[0].quantity, cityProd + 2);
											dbHandler.get.user(userId, function(err, res) {
												assert.notOk(err);
												assert.ok(res[0]);
												assert.strictEqual(res[0].money,userMoney + (productPrice * 2));
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
	it.skip("Build Ship", function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it.skip("Sell Ship", function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it.skip("Repair Ship", function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it.skip("Return Ship", function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
});
