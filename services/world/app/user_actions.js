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

module.exports = {
	moveShip: function(userId, shipId, toCityId, done) {
		return done(new Error("Not implemented"));
		//TODO: need database upgrade
	},
	buyProduct: function(userId, shipId, cityId, productId, quantity, done) {
		if (userId === undefined || cityId === undefined || productId === undefined || quantity < 0) return done(new Error("Not valid data"), false);
		if (quantity === 0) return done(null, true);
		//Check city-ship!!!
		dbHandler.beginTransaction(function(err, connection) {
			if (err) return done(err, false);
			dbHandler.runTransactionQuery("SELECT * FROM " + tables.products + " WHERE id=" + productId, connection, function(err, res) {
				if (err || !res[0]) {
					dbHandler.cancelTransaction(connection);
					return done(err, false);
				}
				var price = res[0].basePrice * quantity;
				dbHandler.update.removeUserMoney(connection, userId, price, function(err, res) {
					if (err || !res) {
						dbHandler.cancelTransaction(connection);
						return done(err, false);
					}
					dbHandler.update.removeCityProduct(connection, cityId, productId, quantity, function(err, res) {
						if (err || !res) {
							dbHandler.cancelTransaction(connection);
							return done(err, false);
						}
						dbHandler.update.addShipProduct(connection, shipId, productId, quantity, function(err, res) {
							if (err || !res) {
								dbHandler.cancelTransaction(connection);
								return done(err, false);
							}
							dbHandler.commitTransaction(connection, function(err) {
								if (err || !res) return done(err, false);
								else return done(null, true);
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
		//Check city-ship!!!
		dbHandler.beginTransaction(function(err, connection) {
			if (err) return done(err, false);
			dbHandler.runTransactionQuery("SELECT * FROM " + tables.products + " WHERE id=" + dbHandler.escapeString(productId), connection, function(err, res) {
				if (err || !res[0]) {
					dbHandler.cancelTransaction(connection);
					return done(err, false);
				}
				var price = res[0].basePrice * quantity;
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
								if (err || !res) return done(err, false);
								else return done(null, true);
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
		//TODO
	},
	//calls ship to return from journey
	returnShip: function(userId, shipId, done) {
		done(new Error('Not implemented'));
		//TODO
	}
};