/*
Name: Databas Handler - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for db Handler
*/

var assert = require('chai').assert;
var async = require('async');

var data = require('./config/data');
var dbHandler = require('../app/dbhandler.js');
var tables = dbHandler.tables;


var auxFunc = require('./config/functions.js');

/*
var data = require('./config/data.js');
var Models = dbHandler.models;
*/


describe('Database Handler', function() {
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
			done();
		});
	});
	after(function(done) {
		dbHandler.clearTables(function(err) {
			assert.notOk(err);
			done();
		});
	});
	it('Transactions', function(done) {
		var user = data.users.arthur;
		var user2 = data.users.ford;
		var query1 = "INSERT INTO " + tables.users + " (id,money) VALUES (" + user.id + "," + user.money + ")";
		var query2 = "INSERT INTO " + tables.users + " (id,money) VALUES (" + user2.id + "," + user2.money + ")";

		dbHandler.beginTransaction(function(err, connection) {
			assert.notOk(err);
			assert.ok(connection);
			dbHandler.runTransactionQuery(query1, connection, function(err) {
				assert.notOk(err);
				dbHandler.runTransactionQuery(query2, connection, function(err) {
					assert.notOk(err);
					dbHandler.commitTransaction(connection, function(err) {
						assert.notOk(err);
						dbHandler.get.all(tables.users, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.length, 2);
							done();
						});
					});
				});
			});
		});
	});
	it('Insert and Get User', function(done) {
		var user = data.users.arthur;
		var user2 = data.users.ford;
		assert.ok(user);
		dbHandler.insert.user(user.id, user, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.strictEqual(res, user.id);
			dbHandler.insert.user(user2.id, user2, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.strictEqual(res, user2.id);
				dbHandler.insert.user(user.id, user, function(err, res) {
					assert.ok(err);
					assert.isUndefined(res);
					dbHandler.get.all(tables.users, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.strictEqual(res.length, 2);
						dbHandler.get.user(user.id, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.length, 1);
							assert.strictEqual(res[0].id, user.id);
							assert.strictEqual(res[0].money, user.money);
							dbHandler.get.user("11111", function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.length, 0);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('User Validation', function(done) {
		var correctElements = 0;
		async.each(Object.keys(data.users), function(key, callback) {
				if (data.users.hasOwnProperty(key)) {
					var user = data.users[key];
					var isCorrect = user.correct;
					if (isCorrect === true) correctElements++;
					dbHandler.insert.user(user.id, user, function(err, res) {
						if (isCorrect) {
							assert.notOk(err);
							assert.isDefined(res);
						} else {
							assert.ok(err);
							assert.isUndefined(res);
						}
						callback();
					});
				}
			},
			function(err) {
				assert.notOk(err);
				dbHandler.get.all(tables.users, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res.length, correctElements);
					done();
				});
			});
	});
	it('Insert and Get City', function(done) {
		var city = data.cities.minasTirith;
		var city2 = data.cities.isengard;
		dbHandler.insert.city(city, function(err, res) {
			assert.notOk(err);
			assert.isDefined(res);
			dbHandler.insert.city(city2, function(err, res) {
				assert.notOk(err);
				assert.isDefined(res);
				dbHandler.insert.city(city2, function(err, res) {
					assert.ok(err);
					assert.isUndefined(res);
					dbHandler.get.all(tables.cities, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.strictEqual(res.length, 2);
						city = res[0];
						dbHandler.get.byId(tables.cities, city.id, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.length, 1);
							assert.ok(res[0].id);
							assert.strictEqual(res[0].name, city.name);
							assert.strictEqual(res[0].positionX, city.positionX);
							assert.strictEqual(res[0].positionY, city.positionY);
							dbHandler.get.byId(tables.cities, "11111", function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.length, 0);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('City Validation', function(done) {
		var correctElements = 0;
		async.each(Object.keys(data.cities), function(key, callback) {
				if (data.cities.hasOwnProperty(key)) {
					var city = data.cities[key];
					var isCorrect = city.correct;
					if (isCorrect === true) correctElements++;
					dbHandler.insert.city(city, function(err, res) {
						if (isCorrect) {
							assert.notOk(err);
							assert.isDefined(res);
						} else {
							assert.ok(err);
							assert.isUndefined(res);
						}
						callback();
					});
				}
			},
			function(err) {
				assert.notOk(err);
				dbHandler.get.all(tables.cities, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res.length, correctElements);
					done();
				});
			});
	});
	it('Insert and Get Product', function(done) {
		var product = data.products.bread;
		var product2 = data.products.redmeat;
		dbHandler.insert.product(product, function(err, res) {
			assert.notOk(err);
			assert.isDefined(res);
			dbHandler.insert.product(product2, function(err, res) {
				assert.notOk(err);
				assert.isDefined(res);
				dbHandler.insert.product(product2, function(err, res) {
					assert.ok(err);
					assert.isUndefined(res);
					dbHandler.get.all(tables.products, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.strictEqual(res.length, 2);
						product = res[0];
						assert.ok(product.basePrice);
						assert.ok(product.baseConsumption);
						assert.ok(product.basePrice);
						dbHandler.get.byId(tables.products, product.id, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.length, 1);
							assert.ok(res[0].id);
							assert.strictEqual(res[0].name, product.name);
							assert.strictEqual(res[0].basePrice, product.basePrice);
							assert.strictEqual(res[0].baseConsumption, product.baseConsumption);
							assert.strictEqual(res[0].baseProduction, product.baseProduction);
							assert.strictEqual(res[0].weight, product.weight);
							dbHandler.get.byId(tables.products, "11111", function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.length, 0);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('Product Validation', function(done) {
		var correctElements = 0;
		async.each(Object.keys(data.products), function(key, callback) {
				if (data.products.hasOwnProperty(key)) {
					var product = data.products[key];
					var isCorrect = product.correct;
					if (isCorrect === true) correctElements++;
					dbHandler.insert.product(product, function(err, res) {
						if (isCorrect) {
							assert.notOk(err);
							assert.isDefined(res);
						} else {
							assert.ok(err);
							assert.isUndefined(res);
						}
						callback();
					});
				}
			},
			function(err) {
				assert.notOk(err);
				dbHandler.get.all(tables.products, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res.length, correctElements);
					done();
				});
			});
	});
	it('Insert and Get Ship Model', function(done) {
		var ship = data.ships.galleon;
		assert.ok(ship);
		dbHandler.insert.shipModel(ship, function(err, res) {
			assert.notOk(err);
			assert.isDefined(res);
			dbHandler.insert.shipModel(ship, function(err, res) {
				assert.ok(err);
				assert.isUndefined(res);
				dbHandler.get.all(tables.shipModels, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.strictEqual(res.length, 1);
					var shipId = res[0].id;
					dbHandler.get.byId(tables.shipModels, shipId, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.ok(res[0]);
						assert.strictEqual(res[0].id, shipId);
						assert.strictEqual(res[0].name, ship.name);
						assert.strictEqual(res[0].life, ship.life);
						assert.strictEqual(res[0].speed, ship.speed);
						assert.strictEqual(res[0].price, ship.price);
						assert.strictEqual(res[0].cargo, ship.cargo);
						done();
					});
				});
			});
		});
	});
	it('Ship Model Validation', function(done) {
		var correctElements = 0;
		async.each(Object.keys(data.ships), function(key, callback) {
				if (data.ships.hasOwnProperty(key)) {
					var ship = data.ships[key];
					var isCorrect = ship.correct;
					if (isCorrect === true) correctElements++;
					dbHandler.insert.shipModel(ship, function(err, res) {
						if (isCorrect) {
							assert.notOk(err);
							assert.isDefined(res);
						} else {
							assert.ok(err);
							assert.isUndefined(res);
						}
						callback();
					});
				}
			},
			function(err) {
				assert.notOk(err);
				dbHandler.get.all(tables.shipModels, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res.length, correctElements);
					done();
				});
			});
	});
	it('Insert and Get User Ship', function(done) {
		var ship = data.userShips.blackPearl;
		var user = data.users.arthur;
		var model = data.ships.galleon;
		assert.ok(ship);
		assert.ok(user);
		assert.ok(model);
		dbHandler.insert.userShip(user.id, ship, function(err, res) {
			assert.ok(err); //foreign id not valid
			assert.isUndefined(res);
			dbHandler.insert.user(user.id, user, function(err, res) {
				assert.notOk(err);
				assert.isDefined(res);
				dbHandler.insert.shipModel(model, function(err, res) {
					assert.notOk(err);
					assert.isDefined(res);
					ship.model = res;
					dbHandler.insert.userShip(user.id, ship, function(err, res) {
						assert.notOk(err);
						assert.isDefined(res);
						var shipId = res;
						dbHandler.get.userShips(user.id, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.length, 1);
							dbHandler.get.shipDetails(shipId, function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.length, 1);
								assert.strictEqual(res[0].id, shipId);
								assert.strictEqual(res[0].name, ship.name);
								assert.strictEqual(res[0].model, ship.model);
								assert.strictEqual(res[0].userId, user.id);
								assert.strictEqual(res[0].status, ship.status);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('User Ship Validation', function(done) {
		var correctElements = 0;
		var user = data.users.arthur;
		var model = data.ships.galleon;
		dbHandler.insert.user(user.id, user, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			dbHandler.insert.shipModel(model, function(err, res) {
				assert.notOk(err);
				assert.ok(res);


				async.each(Object.keys(data.userShips), function(key, callback) {
						if (data.userShips.hasOwnProperty(key)) {
							var ship = data.userShips[key];
							var isCorrect = ship.correct;
							if (isCorrect === true) correctElements++;
							dbHandler.insert.userShip(user.id, ship, function(err, res) {
								if (isCorrect) {
									assert.notOk(err);
									assert.isDefined(res);
								} else {
									assert.ok(err);
									assert.isUndefined(res);
								}
								callback();
							});
						}
					},
					function(err) {
						assert.notOk(err);
						dbHandler.get.all(tables.userShips, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res.length, correctElements);
							done();
						});
					});
			});
		});
	});
	it('Insert and Get Ship Product', function(done) {
		var product = data.products.bread;
		var ship = data.userShips.blackPearl;
		var user = data.users.arthur;
		var model = data.ships.galleon;
		dbHandler.insert.user(user.id, user, function(err, res) {
			assert.notOk(err);
			var userId = res;
			dbHandler.insert.shipModel(model, function(err, res) {
				assert.notOk(err);
				ship.model = res;
				dbHandler.insert.userShip(user.id, ship, function(err, res) {
					assert.notOk(err);
					var shipId = res;
					dbHandler.insert.product(product, function(err, res) {
						assert.notOk(err);
						var productId = res;
						dbHandler.insert.shipProduct(shipId, productId, {
							quantity: 100
						}, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res.length, 2);
							dbHandler.get.shipProducts(shipId, function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.length, 1);
								assert.strictEqual(res[0].quantity, 100);
								assert.isDefined(res[0].shipId);
								assert.isDefined(res[0].productId);
								assert.strictEqual(res[0].shipId, shipId);
								assert.strictEqual(res[0].productId, productId);
								dbHandler.get.shipProduct(shipId, res[0].productId, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									assert.strictEqual(res.length, 1);
									assert.isDefined(res[0].productId);
									dbHandler.get.shipProduct(shipId, 44, function(err, res) {
										assert.notOk(err);
										assert.ok(res);
										assert.strictEqual(res.length, 0);
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
	it('Insert and Get City Products', function(done) {
		var city = data.cities.minasTirith;
		var product = data.products.bread;
		dbHandler.insert.product(product, function(err, res) {
			assert.notOk(err);
			assert.isDefined(res);
			var productId = res;
			dbHandler.insert.city(city, function(err, res) {
				assert.notOk(err);
				assert.isDefined(res);
				var cityId = res;
				dbHandler.insert.cityProduct(cityId, productId, {
					quantity: 100
				}, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.strictEqual(res.length, 2);
					dbHandler.get.cityProducts(cityId, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.strictEqual(res.length, 1);
						assert.strictEqual(res[0].productId, productId);
						assert.strictEqual(res[0].cityId, cityId);
						assert.strictEqual(res[0].quantity, 100);
						dbHandler.get.cityProduct(cityId, res[0].productId, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res.length, 1);
							assert.isDefined(res[0].productId);
							dbHandler.get.cityProduct(cityId, 44, function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								assert.strictEqual(res.length, 0);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('Add User Money', function(done) {
		var user = data.users.arthur;
		dbHandler.insert.user(user.id, user, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			dbHandler.get.byId(tables.users, user.id, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				var money = res[0].money;
				dbHandler.beginTransaction(function(err, connection) {
					assert.notOk(err);
					assert.ok(connection);
					dbHandler.update.addUserMoney(connection, user.id, 100, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						dbHandler.update.addUserMoney(connection, user.id, -100, function(err, res) {
							assert.ok(err);
							assert.notOk(res);
							dbHandler.commitTransaction(connection, function(err) {
								assert.notOk(err);
								dbHandler.get.byId(tables.users, user.id, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									assert.strictEqual(res[0].money, money + 100);
									done();
								});
							});
						});
					});
				});
			});
		});
	});
	it('Remove User Money', function(done) {
		var user = data.users.arthur;
		dbHandler.insert.user(user.id, user, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			dbHandler.get.byId(tables.users, user.id, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				var money = res[0].money;
				dbHandler.beginTransaction(function(err, connection) {
					assert.notOk(err);
					assert.ok(connection);
					dbHandler.update.removeUserMoney(connection, user.id, 90, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						dbHandler.update.removeUserMoney(connection, user.id, -100, function(err, res) {
							assert.ok(err);
							assert.notOk(res);
							dbHandler.update.removeUserMoney(connection, user.id, 100, function(err, res) {
								assert.ok(err);
								assert.notOk(res);
								dbHandler.commitTransaction(connection, function(err) {
									assert.notOk(err);
									dbHandler.get.byId(tables.users, user.id, function(err, res) {
										assert.notOk(err);
										assert.ok(res);
										assert.strictEqual(res[0].money, money - 90);
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
	it('Add/Remove Ship Product', function(done) {
		var user = data.users.arthur;
		auxFunc.insertData(function() {
			dbHandler.get.userShips(user.id, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				var shipId = res[0].id;
				dbHandler.get.shipProducts(shipId, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.ok(res[0]);
					var prod = res[0];
					async.series([function(callback) {
						dbHandler.beginTransaction(function(err, connection) {
							assert.notOk(err);
							assert.ok(connection);
							dbHandler.update.addShipProduct(connection, shipId, prod.productId, -5, function(err, res) {
								assert.ok(err);
								assert.notOk(res);
								dbHandler.update.addShipProduct(connection, shipId, prod.productId, 5, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									dbHandler.commitTransaction(connection, function(err) {
										assert.notOk(err);
										dbHandler.get.shipProduct(shipId, prod.productId, function(err, res) {
											assert.notOk(err);
											assert.ok(res);
											assert.ok(res[0]);
											assert.strictEqual(res[0].quantity, prod.quantity + 5);
											callback();
										});
									});
								});
							});
						});
					}, function(callback) {
						dbHandler.beginTransaction(function(err, connection) {
							assert.notOk(err);
							assert.ok(connection);
							dbHandler.update.removeShipProduct(connection, shipId, prod.productId, -5, function(err, res) {
								assert.ok(err);
								assert.notOk(res);
								dbHandler.update.removeShipProduct(connection, shipId, prod.productId, 5, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									dbHandler.commitTransaction(connection, function(err) {
										assert.notOk(err);
										dbHandler.get.shipProduct(shipId, prod.productId, function(err, res) {
											assert.notOk(err);
											assert.ok(res);
											assert.ok(res[0]);
											assert.strictEqual(res[0].quantity, prod.quantity);
											done();
										});
									});
								});
							});
						});
					}]);
				});
			});
		});
	});

	it('Add/Remove City Product', function(done) {
		var user = data.users.arthur;
		auxFunc.insertData(function() {
			dbHandler.get.all(tables.cities, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.ok(res[0]);
				var cityId = res[0].id;
				dbHandler.get.cityProducts(res[0].id, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.ok(res[0]);
					var prod = res[0];
					async.series([function(callback) {
						dbHandler.beginTransaction(function(err, connection) {
							assert.notOk(err);
							assert.ok(connection);
							dbHandler.update.addCityProduct(connection, cityId, prod.productId, -5, function(err, res) {
								assert.ok(err);
								assert.notOk(res);
								dbHandler.update.addCityProduct(connection, cityId, prod.productId, 5, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									dbHandler.commitTransaction(connection, function(err) {
										assert.notOk(err);
										dbHandler.get.cityProducts(cityId, function(err, res) {
											assert.notOk(err);
											assert.ok(res);
											assert.ok(res[0]);
											assert.strictEqual(res[0].quantity, prod.quantity + 5);
											callback();
										});
									});
								});
							});
						});
					}, function(callback) {
						dbHandler.beginTransaction(function(err, connection) {
							assert.notOk(err);
							assert.ok(connection);
							dbHandler.update.removeCityProduct(connection, cityId, prod.productId, -5, function(err, res) {
								assert.ok(err);
								assert.notOk(res);
								dbHandler.update.removeCityProduct(connection, cityId, prod.productId, 5, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									dbHandler.commitTransaction(connection, function(err) {
										assert.notOk(err);
										dbHandler.get.cityProducts(cityId, function(err, res) {
											assert.notOk(err);
											assert.ok(res);
											assert.ok(res[0]);
											assert.strictEqual(res[0].quantity, prod.quantity);
											done();
										});
									});
								});
							});
						});
					}]);
				});
			});
		});
	});
});
