/*
Name: User Actions
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: User actions to perform in the world (API)
*/

var dbHandler = require('./dbhandler.js');
var tables = dbHandler.tables;
var Models = dbHandler.models;
var Get = require('./get_actions.js');
var gameLogic = require('./game_logic');




module.exports = {
	moveShip: function(userId, shipId, toCityId, done) {
		if (userId === undefined || shipId === undefined || toCityId === undefined) return done(new Error("Not valid data"));
		dbHandler.beginTransaction(function(err, connection) {
			if (err) return done(err);
			dbHandler.runTransactionQuery("SELECT * FROM " + tables.userShips + " WHERE id=" + dbHandler.escapeString(shipId), connection, function(err, res) {
				if (err) {
					dbHandler.cancelTransaction(connection);
					return done(err, false);
				}

				if (!res || !res[0]) return done(new Error("Not valid ship"));
				if (!res[0].city || res[0].status !== "docked") return done(new Error("Ship not docked"));
				var currentCity = res[0].city;
				dbHandler.runTransactionQuery("SELECT speed FROM " + tables.shipModels + " WHERE id=" + res[0].model, connection, function(err, res) {
					if (err) {
						dbHandler.cancelTransaction(connection);
						return done(err, false);
					}
					var speed = res[0].speed;


					dbHandler.runTransactionQuery("SELECT * FROM " + tables.cities + " WHERE id IN (" + currentCity + "," + dbHandler.escapeString(toCityId) + ")", connection, function(err, res) {
						if (err) {
							dbHandler.cancelTransaction(connection);
							return done(err, false);
						}
						if (!res || res.length !== 2) return done(new Error("Not valid cities"));

						var posx1 = res[0].positionX;
						var posx2 = res[1].positionX;
						var posy1 = res[0].positionY;
						var posy2 = res[1].positionY;
						var dx = Math.abs(posx2 - posx1);
						var dy = Math.abs(posy2 - posy1);
						var distance = Math.sqrt(dx * dx + dy * dy);

						var remaining = distance / speed;
						dbHandler.runTransactionQuery("UPDATE " + tables.userShips + " SET status=\"sailing\",city=" + currentCity + ",destiny=" + dbHandler.escapeString(toCityId) + ",remaining=" + remaining + " WHERE id=" + dbHandler.escapeString(shipId), connection, function(err, res) {
							if (err) {
								dbHandler.cancelTransaction(connection);
								return done(err, false);
							}
							dbHandler.commitTransaction(connection, function(err) {
								if (err) return done(err, false);
								else return done(null, true);
							});
						});
					});
				});
			});
		});
	},
	buyProduct: function(userId, shipId, cityId, productId, quantity, done) {
		if (userId === undefined || cityId === undefined || productId === undefined || quantity < 0) return done(new Error("Not valid data"), false);
		if (quantity === 0) return done(null, true);
		//TODO: Check city-ship and cargo

		dbHandler.beginTransaction(function(err, connection) {
			if (err) return done(err, false);
			dbHandler.runTransactionQuery("SELECT * FROM " + tables.products + " WHERE id=" + dbHandler.escapeString(productId), connection, function(err, res) {
				if (err || !res) {
					dbHandler.cancelTransaction(connection);
					if (!err) err = new Error("product not found");
					return done(err, false);
				}
				var bPrice = res[0].basePrice;
				dbHandler.runTransactionQuery("SELECT * FROM " + tables.cityProducts + " WHERE cityId=" + dbHandler.escapeString(cityId) + " AND productId=" + dbHandler.escapeString(productId), connection, function(err, res) {
					if (err || !res) {
						dbHandler.cancelTransaction(connection);
						if (!err) err = new Error("product not found");
						return done(err, false);
					}
					var prod = res[0].production;
					var cons = res[0].consumption;
					var cityq = res[0].quantity;
					var price = gameLogic.buyingPrice(res[0].quantity, res[0].production, res[0].consumption, bPrice, quantity);
					dbHandler.update.removeUserMoney(connection, userId, price, function(err, res) {
						if (err || !res) {
							dbHandler.cancelTransaction(connection);
							if (!err) err = new Error("User money not removed");
							return done(err, false);
						}
						dbHandler.update.removeCityProduct(connection, cityId, productId, quantity, function(err, res) {
							if (err || !res) {
								dbHandler.cancelTransaction(connection);
								if (!res) err = new Error("City product not removed");
								return done(err, false);
							}
							dbHandler.update.addShipProduct(connection, shipId, productId, quantity, function(err, res) {
								if (err || !res) {
									dbHandler.cancelTransaction(connection);
									if (!res) err = new Error("Ship product not added");
									return done(err, false);
								}
								dbHandler.commitTransaction(connection, function(err) {
									if (err) return done(err, false);
									else return done(null, true);
								});
							});
						});
					});
				});
			});
		});
	},
	sellProduct: function(userId, shipId, cityId, productId, quantity, done) {
		if (userId === undefined || cityId === undefined || productId === undefined || quantity < 0) return done(new Error("Not valid data"), false);
		if (quantity === 0) return done(null, true);
		//TODO: Check city-ship
		dbHandler.beginTransaction(function(err, connection) {
			if (err) return done(err, false);
			dbHandler.runTransactionQuery("SELECT * FROM " + tables.products + " WHERE id=" + dbHandler.escapeString(productId), connection, function(err, res) {
				if (err || !res[0]) {
					dbHandler.cancelTransaction(connection);
					return done(err, false);
				}
				var bPrice = res[0].basePrice;
				dbHandler.runTransactionQuery("SELECT * FROM " + tables.cityProducts + " WHERE cityId=" + dbHandler.escapeString(cityId) + " AND productId=" + dbHandler.escapeString(productId), connection, function(err, res) {
					if (err || !res) {
						dbHandler.cancelTransaction(connection);
						if (!err) err = new Error("product not found");
						return done(err, false);
					}
					var prod = res[0].production;
					var cons = res[0].consumption;
					var cityq = res[0].quantity;
					var price = gameLogic.sellingPrice(res[0].quantity, res[0].production, res[0].consumption, bPrice, quantity);
					dbHandler.update.addUserMoney(connection, userId, price, function(err, res) {
						if (err || !res) {
							dbHandler.cancelTransaction(connection);
							return done(err, false);
						}
						dbHandler.update.addCityProduct(connection, cityId, productId, quantity, function(err, res) {
							if (err || !res) {
								dbHandler.cancelTransaction(connection);
								return done(err, false);
							}
							dbHandler.update.removeShipProduct(connection, shipId, productId, quantity, function(err, res) {
								if (err || !res) {
									dbHandler.cancelTransaction(connection);
									return done(err, false);
								}
								dbHandler.commitTransaction(connection, function(err) {
									if (err) return done(err, false);
									else return done(null, true);
								});
							});
						});
					});
				});
			});
		});
	},
	buildShip: function(userId, shipModelId, cityId, shipName, done) {
		if (userId === undefined || cityId === undefined || !shipName || shipModelId === undefined) return done(new Error("Not valid data"));
		var escapeString = dbHandler.escapeString;
		var defaultStatus = "docked";
		dbHandler.beginTransaction(function(err, connection) {
			if (err) return done(err);
			dbHandler.runTransactionQuery("SELECT * FROM " + tables.shipModels + " WHERE id=" + dbHandler.escapeString(shipModelId), connection, function(err, res) {
				if (err) {
					dbHandler.cancelTransaction(connection);
					return done(err);
				}
				if (!res[0]) {
					dbHandler.cancelTransaction(connection);
					return done(new Error("Not valid model"));
				}
				var shipModel = res[0];
				dbHandler.update.removeUserMoney(connection, userId, shipModel.price, function(err, res) {
					if (err || !res) {
						dbHandler.cancelTransaction(connection);
						return done(err);
					}
					var query = "INSERT INTO " + tables.userShips + " (userId,name,model,life,status,city) VALUES(" + escapeString(userId) + "," + escapeString(shipName) + "," + escapeString(shipModel.id) + "," + escapeString(shipModel.life) + "," + escapeString(defaultStatus) + "," + escapeString(cityId) + ")";
					dbHandler.runTransactionQuery(query, connection, function(err, res) {
						if (err) {
							dbHandler.cancelTransaction(connection);
							return done(err);
						}
						var userShipId = res.insertId;
						if (userShipId === undefined || userShipId === null) {
							dbHandler.cancelTransaction(connection);
							return done(new Error("Inserted id not valid"));
						}
						dbHandler.commitTransaction(connection, function(err) {
							if (err) return done(err);
							else return done(null, userShipId);
						});
					});
				});
			});
		});
	},
	sellShip: function(shipId, userId, done) {
		if (userId === undefined || shipId === undefined) return done(new Error("Not valid data"));
		dbHandler.beginTransaction(function(err, connection) {
			dbHandler.runTransactionQuery("SELECT * FROM " + tables.userShips + " WHERE id=" + dbHandler.escapeString(shipId), connection, function(err, res) {
				if (err) {
					dbHandler.cancelTransaction(connection);
					return done(err, false);
				}
				if (!res[0]) {
					dbHandler.cancelTransaction(connection);
					return done(new Error("Not valid Ship ID"), false);
				}
				var shipModel = res[0].model;
				dbHandler.runTransactionQuery("SELECT price FROM " + tables.shipModels + " WHERE id=" + shipModel, connection, function(err, res) {
					if (err) {
						dbHandler.cancelTransaction(connection);
						return done(err, false);
					}
					if (!res[0]) {
						dbHandler.cancelTransaction(connection);
						return done(new Error("Not valid Ship Model"));
					}
					var price = res[0].price;

					dbHandler.update.addUserMoney(connection, userId, price, function(err, res) {
						if (err || res === false) {
							dbHandler.cancelTransaction(connection);
							return done(err, false);
						}
						dbHandler.runTransactionQuery("DELETE FROM " + tables.userShips + " WHERE id=" + dbHandler.escapeString(shipId), connection, function(err, res) {
							if (err) {
								dbHandler.cancelTransaction(connection);
								return done(err, false);
							}
							dbHandler.commitTransaction(connection, function(err) {
								if (err) return done(err, false);
								else return done(null, true);
							});
						});
					});
				});
			});
		});
	},
	repairShip: function(userId, shipId, done) {
		done(new Error('Not implemented'));
		//TODO: repair ship
	},
	//calls ship to return from journey
	returnShip: function(userId, shipId, done) {
		done(new Error('Not implemented'));
		//TODO: return ship
	}
};