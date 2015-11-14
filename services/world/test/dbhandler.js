/*
Name: Databas Handler - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for db Handler
*/

var assert = require('chai').assert;
var async = require('async');
var mongoose = require('mongoose');

var auxFunc = require('./config/functions.js');

var dbHandler = require('../app/dbhandler.js');
var data = require('./config/data.js');
var Models = dbHandler.models;


describe('Database Handler', function() {
	this.timeout(2000);
	var db;
	before(function(done) {
		db = auxFunc.connectDB(function(err) {
			assert.notOk(err);
			done();
		});
	});
	beforeEach(function(done) {
		auxFunc.clearDB(function(err) {
			assert.notOk(err);
			auxFunc.insertAllData(function(err) {
				assert.notOk(err);
				done();
			});
		});
	});
	after(function(done) {
		auxFunc.clearDB(function(err) {
			assert.notOk(err);
			db.close(done);
		});
	});
	it('Models', function() {
		assert.ok(dbHandler.models);
		assert.ok(dbHandler.models.City);
		assert.ok(dbHandler.models.Product);
		assert.ok(dbHandler.models.User);
		assert.ok(dbHandler.models.Ship);
	});
	it('Get Ship', function(done) {
		var shipId;
		var userId = data.users.ohCaptainMyCaptain._id;
		assert.ok(userId);
		Models.User.find({
			_id: userId
		}, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.ok(res[0]);
			assert.ok(res[0].ships[0]);
			shipId = res[0].ships[0]._id;
			assert.ok(shipId);
			dbHandler.getShip(userId, shipId, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.equal(res.id, shipId);
				assert.ok(res.name);
				assert.ok(res.model);
				dbHandler.getShip(userId, mongoose.Types.ObjectId(), function(err, res) {
					assert.notOk(err);
					assert.notOk(res);
					done();
				});
			});
		});
	});
	it('User Money', function(done) {
		var userId;
		Models.User.find({}, function(err, res) {
			var quantity = 140;
			userId = res[0].id;
			async.each(res, function(user, callback) {
				assert.ok(user);
				var userMoney = user.money;
				dbHandler.removeMoney(user.id, quantity, function(err, res) {
					assert.notOk(err);
					if (userMoney < quantity) {
						assert.notOk(res);
						assert.strictEqual(res, false);
					} else {
						assert.ok(res);
						assert.strictEqual(res, true);
					}
					Models.User.find({
						_id: user.id
					}, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						if (userMoney < quantity) assert.strictEqual(res[0].money, userMoney);
						else assert.strictEqual(res[0].money, userMoney - quantity);

						dbHandler.addMoney(user.id, quantity, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res, true);
							Models.User.find({
								_id: user.id
							}, function(err, res) {
								if (userMoney < quantity) assert.strictEqual(res[0].money, userMoney + quantity);
								else assert.strictEqual(res[0].money, userMoney);
								callback();
							});
						});
					});

				});
			}, function(err) {
				assert.notOk(err);
				dbHandler.removeMoney(userId, -10, function(err, res) {
					assert.ok(err);
					assert.notOk(res);
					assert.strictEqual(res, false);
					dbHandler.removeMoney(mongoose.Types.ObjectId(), 10, function(err, res) {
						assert.ok(err);
						assert.notOk(res);
						assert.strictEqual(res, false);
						dbHandler.addMoney(userId, -10, function(err, res) {
							assert.ok(err);
							assert.notOk(res);
							assert.strictEqual(res, false);
							dbHandler.addMoney(mongoose.Types.ObjectId(), 10, function(err, res) {
								assert.ok(err);
								assert.notOk(res);
								assert.strictEqual(res, false);
								done();
							});
						});
					});
				});
			});
		});
	});
	//wont be implemented
	it.skip('Update Ship', function(done) {
		var newShip = {
			name: "Happy Ship"
		};
		var userId = data.users.arthur._id;
		Models.User.find({
			_id: userId
		}, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.ok(res[0]);
			assert.ok(res[0].ships[0]);
			assert.strictEqual(res[0].ships.length, 1);
			assert.strictEqual(res[0].ships[0].name, data.users.arthur.ships[0].name);
			shipId = res[0].ships[0]._id;
			dbHandler.updateShip(userId, shipId, newShip, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.strictEqual(res, true);
				Models.User.find({
					_id: userId
				}, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.ok(res[0].ships[0]);
					assert.strictEqual(res[0].ships.length, 1);
					assert.equal(res[0].ships[0]._id, shipId);
					assert.strictEqual(res[0].ships[0].name, newShip.name);
					dbHandler.updateShip(mongoose.Types.ObjectId(), shipId, newShip, function(err, res) {
						assert.ok(err);
						assert.notOk(res);
						assert.strictEqual(res, false);
						dbHandler.updateShip(userId, mongoose.Types.ObjectId(), newShip, function(err, res) {
							assert.ok(err);
							assert.notOk(res);
							assert.strictEqual(res, false);
							//TODO: test invalid updates (id, products...)
							done(new Error("Not in use"));
						});
					});

				});
			});
		});
	});
	it('Add Ship', function(done) {
		var userId = data.users.arthur._id;
		var ship = {
			name: "Flying Dutchman2",
			model: mongoose.Types.ObjectId(),
			life: 310,
			speed: 15,
			products: [],
			city: mongoose.Types.ObjectId()
		};
		assert.ok(userId);
		dbHandler.addShip(userId, ship, function(err, res) {
			assert.notOk(err);
			assert.strictEqual(res, true);
			Models.User.findOne({
				_id: userId
			}, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.strictEqual(res.ships.length, 2);
				assert.ok(res.ships[1]);
				assert.ok(res.ships[1]._id);
				assert.strictEqual(res.ships[1].name, "Flying Dutchman2");
				assert.ok(res.ships[1].products);
				assert.strictEqual(res.ships[1].products.length, 0);
				assert.equal(res.ships[1].model, ship.model.toString());
				dbHandler.addShip(mongoose.Types.ObjectId(), ship, function(err, res) {
					assert.notOk(err);
					assert.notOk(res);
					assert.strictEqual(res, false);
					dbHandler.addShip(userId, {}, function(err, res) {
						assert.ok(err);
						assert.strictEqual(res, false);
						Models.User.findOne({
							_id: userId
						}, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res.ships.length, 2);
							done();
						});
					});
				});
			});
		});
	});
	it('Get City Product', function(done) {
		Models.City.findOne({
			name: data.cities.minasTirith.name
		}, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var cityInfo = res;
			var cityId = res.id;
			var product0 = res.products[0].id;
			var product1 = res.products[1].id;

			dbHandler.getCityProduct(cityId, product0, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.equal(res.id, product0);
				assert.equal(res.quantity, cityInfo.products[0].quantity);
				assert.equal(res.production, cityInfo.products[0].production);
				assert.equal(res.consume, cityInfo.products[0].consume);
				dbHandler.getCityProduct(cityId, product1, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.equal(res.id, product1);
					assert.equal(res.quantity, cityInfo.products[1].quantity);
					assert.equal(res.production, cityInfo.products[1].production);
					assert.equal(res.consume, cityInfo.products[1].consume);
					dbHandler.getCityProduct(cityId, mongoose.Types.ObjectId(), function(err, res) {
						assert.notOk(err);
						assert.notOk(res);
						dbHandler.getCityProduct(mongoose.Types.ObjectId(), product1, function(err, res) {
							assert.notOk(err);
							assert.notOk(res);
							dbHandler.getCityProduct(mongoose.Types.ObjectId(), mongoose.Types.ObjectId(), function(err, res) {
								assert.notOk(err);
								assert.notOk(res);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('Exists Id', function(done) {
		var randId = mongoose.Types.ObjectId();
		async.parallel([
			function(callback) {
				Models.User.find({}, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					async.each(res, function(user, callback) {
						assert.ok(user);
						dbHandler.isUser(user.id, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res, true);
							callback();
						});
					}, function(err) {
						assert.notOk(err);
						dbHandler.isUser(randId, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res, false);
							callback();
						});
					});
				});
			},
			function(callback) {
				Models.Ship.find({}, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					async.each(res, function(ship, callback) {
						assert.ok(ship);
						dbHandler.isShipModel(ship.id, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res, true);
							callback();
						});
					}, function(err) {
						assert.notOk(err);
						dbHandler.isShipModel(randId, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res, false);
							callback();
						});
					});
				});
			},
			function(callback) {
				Models.Product.find({}, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					async.each(res, function(product, callback) {
						assert.ok(product);
						dbHandler.isProduct(product.id, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res, true);
							callback();
						});
					}, function(err) {
						assert.notOk(err);
						dbHandler.isProduct(randId, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res, false);
							callback();
						});
					});
				});
			},
			function(callback) {
				Models.City.find({}, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					async.each(res, function(city, callback) {
						assert.ok(city);
						dbHandler.isCity(city.id, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res, true);
							callback();
						});
					}, function(err) {
						assert.notOk(err);
						dbHandler.isCity(randId, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res, false);
							callback();
						});
					});
				});
			}
		], function(err) {
			assert.notOk(err);
			done();
		});
	});
	it('Get Ship Product', function(done) {
		var userId = data.users.ohCaptainMyCaptain._id;
		Models.User.findOne({
			_id: userId
		}, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var shipId = res.ships[0].id;
			var product = res.ships[0].products[0];
			var productId = product.id;
			assert.ok(shipId);
			assert.ok(product);
			assert.ok(productId);
			dbHandler.getShipProduct(userId, shipId, productId, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.equal(res.id.toString(), productId.toString());
				assert.strictEqual(res.quantity, product.quantity);
				dbHandler.getShipProduct(mongoose.Types.ObjectId(), shipId, productId, function(err, res) {
					assert.notOk(err);
					assert.notOk(res);
					dbHandler.getShipProduct(userId, mongoose.Types.ObjectId(), productId, function(err, res) {
						assert.notOk(err);
						assert.notOk(res);
						dbHandler.getShipProduct(userId, shipId, mongoose.Types.ObjectId(), function(err, res) {
							assert.notOk(err);
							assert.notOk(res);
							done();
						});
					});
				});
			});
		});
	});
	it("Add/Remove Ship Products", function(done) {
		var userId = data.users.ohCaptainMyCaptain._id;
		Models.User.findOne(userId, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var productLength = res.ships[0].products.length;
			var shipId = res.ships[0]._id;
			var productId = res.ships[0].products[0].id;
			dbHandler.removeShipProduct(userId, shipId, productId, function(err, res) {
				assert.notOk(err);
				//			assert.ok(res);
				Models.User.findOne(userId, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.strictEqual(res.ships[0].products.length, productLength - 1);
					dbHandler.removeShipProduct(userId, shipId, productId, function(err, res) {
						assert.notOk(err);
						//assert.notOk(res);
						Models.User.findOne(userId, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.ships[0].products.length, productLength - 1);
							dbHandler.addShipProduct(userId, shipId, {
								id: productId,
								quantity: 250,
								crap: "invalid message"
							}, function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								Models.User.findOne(userId, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									assert.strictEqual(res.ships[0].products.length, productLength);
									var prod = res.ships[0].products[productLength - 1];
									assert.equal(prod.id.toString(), productId.toString());
									assert.strictEqual(prod.quantity, 250);
									assert.notOk(prod.crap);
									dbHandler.addShipProduct(userId, shipId, {
										id: productId,
									}, function(err, res) {
										assert.ok(err);
										assert.notOk(res);
										Models.User.findOne(userId, function(err, res) {
											assert.notOk(err);
											assert.ok(res);
											assert.strictEqual(res.ships[0].products.length, productLength);
											var prod = res.ships[0].products[productLength - 1];
											assert.equal(prod.id.toString(), productId.toString());
											assert.strictEqual(prod.quantity, 250);
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
	it('Add City Product Quantity', function(done) {
		Models.City.findOne({
			name: data.cities.minasTirith.name
		}, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var cityId = res.id;
			var productId = res.products[0].id;
			var productQuantity = res.products[0].quantity;
			dbHandler.addCityProductQuantity(cityId, productId, 50, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				Models.City.findOne({
					name: data.cities.minasTirith.name
				}, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.strictEqual(res.products[0].quantity, productQuantity + 50);
					dbHandler.addCityProductQuantity(cityId, productId, -50, function(err, res) {
						assert.ok(err);
						assert.notOk(res);
						dbHandler.addCityProductQuantity(cityId, mongoose.Types.ObjectId(), 50, function(err, res) {
							assert.notOk(err);
							assert.notOk(res);
							done();
						});
					});
				});
			});
		});
	});
	it('Remove City Product Quantity', function(done) {
		Models.City.findOne({
			name: data.cities.minasTirith.name
		}, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var cityId = res.id;
			var productId = res.products[0].id;
			var productQuantity = res.products[0].quantity;
			dbHandler.removeCityProductQuantity(cityId, productId, 50, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				Models.City.findOne({
					name: data.cities.minasTirith.name
				}, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.strictEqual(res.products[0].quantity, productQuantity - 50);
					dbHandler.removeCityProductQuantity(cityId, productId, 5000, function(err, res) {
						assert.notOk(err);
						assert.notOk(res);
						dbHandler.removeCityProductQuantity(cityId, productId, -50, function(err, res) {
							assert.ok(err);
							assert.notOk(res);
							dbHandler.removeCityProductQuantity(cityId, mongoose.Types.ObjectId(), 50, function(err, res) {
								assert.notOk(err);
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
