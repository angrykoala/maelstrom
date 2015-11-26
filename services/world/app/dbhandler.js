/*
Name: Database Handler
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Handler for world database
*/

var mysql = require('mysql');
var async = require('async');
var config = require('../config/database.js');
var Models = require('../config/models.js');
var tables = config.tables;
var pool = mysql.createPool(config.connection);

function getConnection(done) {
	pool.getConnection(function(err, connection) {
		if (err) {
			connection.release();
			return done(new Error("Error connecting to database -" + err));
		} else return done(null, connection);
	});
}

function runQuery(query, done) {
	getConnection(function(err, connection) {
		if (err) return done(err);
		connection.query(query, function(err, rows) {
			connection.release();
			return done(err, rows);
		});
	});
}

function runTransactionQuery(query, connection, done) {
	connection.query(query, function(err, res) {
		if (err) connection.rollback(function() {
			//connection.release();
			return done(err);
		});
		else done(null, res);
	});
}

function createTable(name, schema, done) {
	var query = "CREATE TABLE IF NOT EXISTS " + name + "(" + schema + ")";
	runQuery(query, done);
}

function escapeString(string) {
	return mysql.escape(string);
}

module.exports = {
	tables: tables,
	runQuery: runQuery,
	query: runTransactionQuery,
	close: function(done) {
		pool.end(done);
	},
	beginTransaction: function(done) {
		getConnection(function(err, connection) {
			if (err) return done(err);
			else connection.beginTransaction(function(err) {
				if (err) return done(err);
				else return done(null, connection);
			});
		});
	},
	commitTransaction: function(connection, done) {
		connection.commit(function(err) {
			if (err) {
				connection.rollback(function() {
					connection.release();
					return done(err);
				});
			} else {
				connection.release();
				return done(null);
			}
		});
	},
	dropTables: function(done) {
		var query = "DROP TABLE IF EXISTS " + tables.shipProducts + "," + tables.cityProducts + "," + tables.userShips + "," + tables.users + "," + tables.cities + "," + tables.products + "," + tables.shipModels;
		//var query="DROP TABLE IF EXISTS ship_products,city_products,user_ships,users,cities,products,ship_models;";
		runQuery(query, done);
	},
	clearTables: function(done) {
		async.eachSeries(Object.keys(tables), function(table, callback) {
				var query = "DELETE FROM " + tables[table];
				runQuery(query, callback);
			},
			function(err) {
				done(err);
			});
	},
	createTables: function(done) {
		async.waterfall([
			function(callback) {
				createTable(tables.users, Models.users, function(err, res) {
					if (err) return callback(err);
					else callback(null);
				});
			},
			function(callback) {
				createTable(tables.cities, Models.cities, function(err, res) {
					if (err) return callback(err);
					else callback(null);
				});
			},
			function(callback) {
				createTable(tables.products, Models.products, function(err, res) {
					if (err) return callback(err);
					else callback(null);
				});
			},
			function(callback) {
				createTable(tables.shipModels, Models.shipModels, function(err, res) {
					if (err) return callback(err);
					else callback(null);
				});
			},
			function(callback) {
				createTable(tables.userShips, Models.userShips, function(err, res) {
					if (err) return callback(err);
					else callback(null);
				});
			},
			function(callback) {
				createTable(tables.shipProducts, Models.shipProducts, function(err, res) {
					if (err) return callback(err);
					else callback(null);
				});
			},
			function(callback) {
				createTable(tables.cityProducts, Models.cityProducts, function(err, res) {
					if (err) return callback(err);
					else callback(null);
				});
			}
		], function(err) {
			done(err);
		});
	},
	get: {
		all: function(table, done) {
			var query = "SELECT * FROM " + table;
			runQuery(query, done);
		},
		user: function(id, done) {
			var query = "SELECT * FROM " + tables.users + " WHERE id=" + escapeString(id);
			runQuery(query, done);
		},
		byId: function(table, id, done) {
			var query = "SELECT * FROM " + table + " WHERE id=" + escapeString(id);
			runQuery(query, done);
		},
		userShips: function(userId, done) {
			var query = "SELECT * FROM " + tables.userShips + " WHERE userId=" + escapeString(userId);
			runQuery(query, done);
		},
		shipDetails: function(userId, shipId, done) {
			var query = "SELECT * FROM " + tables.userShips + " WHERE id=" + escapeString(shipId);
			runQuery(query, done);
		},
		shipProducts: function(shipId, done) {
			var query = "SELECT * FROM " + tables.shipProducts + " WHERE shipId=" + escapeString(shipId);
			runQuery(query, done);
		},
		cityProducts: function(cityId, done) {
			var query = "SELECT * FROM " + tables.cityProducts + " WHERE cityId=" + escapeString(cityId);
			runQuery(query, done);
		},
		cityProduct: function(cityId, productId, done) {
			var query = "SELECT * FROM " + tables.cityProducts + " WHERE cityId=" + escapeString(cityId) + " AND productId=" + escapeString(productId);
			runQuery(query, done);
		},
		shipProduct: function(shipId, productId, done) {
			var query = "SELECT * FROM " + tables.shipProducts + " WHERE shipId=" + escapeString(shipId) + " AND productId=" + escapeString(productId);
			runQuery(query, done);
		}
	},
	insert: {
		user: function(userId, userData, done) {
			if (userId === undefined || !userData || userData.money === undefined) return done(new Error("Not user data"));
			var query = "INSERT INTO " + tables.users + " (id,money) VALUES (" + escapeString(userId) + "," + escapeString(userData.money) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, userId);
			});
		},
		city: function(cityData, done) {
			if (!cityData || !cityData.name || cityData.positionX === undefined || cityData.positionY === undefined) return done(new Error("Not city data"));
			var query = "INSERT INTO " + tables.cities + " (name,positionX,positionY) VALUES(" + escapeString(cityData.name) + "," + escapeString(cityData.positionX) + "," + escapeString(cityData.positionY) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, res.insertId);
			});
		},
		product: function(productData, done) {
			if (!productData || !productData.name || productData.basePrice === undefined || productData.baseConsumption === undefined || productData.baseProduction === undefined || productData.weight === undefined) return done(new Error("Not product data"));
			var query = "INSERT INTO " + tables.products + " (name,basePrice,baseProduction,baseConsumption,weight) VALUES(" + escapeString(productData.name) + "," + escapeString(productData.basePrice) + "," + escapeString(productData.baseProduction) + "," + escapeString(productData.baseConsumption) + "," + escapeString(productData.weight) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, res.insertId);
			});
		},
		shipModel: function(shipData, done) {
			if (!shipData || !shipData.name || !shipData.life || !shipData.speed || !shipData.price || !shipData.cargo)
				return done(new Error("No ShipModel data"));
			var query = "INSERT INTO " + tables.shipModels + " (name,life,speed,price,cargo) VALUES(" + escapeString(shipData.name) + "," + escapeString(shipData.life) + "," + escapeString(shipData.speed) + "," + escapeString(shipData.price) + "," + escapeString(shipData.cargo) + ")";

			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, res.insertId);
			});
		},
		userShip: function(userId, shipData, done) {
			if (!userId || !shipData || !shipData.name || !shipData.model || !shipData.life || !shipData.status) return done(new Error("No user ship data"));
			var query = "INSERT INTO " + tables.userShips + " (userId,name,model,life,status) VALUES(" + escapeString(userId) + "," + escapeString(shipData.name) + "," + escapeString(shipData.model) + "," + escapeString(shipData.life) + "," + escapeString(shipData.status) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, res.insertId);
			});
		},
		shipProduct: function(shipId, productId, productData, done) {
			if (shipId === undefined || productId === undefined || !productData) return done(new Error("No product ship data"));
			var query = "INSERT INTO " + tables.shipProducts + " (shipId,productId,quantity) VALUES(" + escapeString(shipId) + "," + escapeString(productId) + "," + escapeString(productData.quantity) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, [shipId, productId]);
			});
		},
		cityProduct: function(cityId, productId, productData, done) {
			if (cityId === undefined || productId === undefined || !productData) return done(new Error("No City product data"));
			var query = "INSERT INTO " + tables.cityProducts + " (cityId,productId,quantity) VALUES (" + escapeString(cityId) + "," + escapeString(productId) + "," + escapeString(productData.quantity) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, [cityId, productId]);
			});
		}
	},
	update: {
		addUserMoney: function(connection, userId, quantity, done) {
			var query1 = "SELECT money FROM " + tables.users + " WHERE id=" + escapeString(userId);
			if (!quantity || quantity < 0) return done(new Error("Money quantity not valid"), false);
			runTransactionQuery(query1, connection, function(err, res) {
				if (err) return done(err, false);
				else if (!res || res.length === 0) return done(new Error("User not found"), false);

				var money = res[0].money + quantity;
				var query2 = "UPDATE " + tables.users + " SET money=" + money + " WHERE id=" + userId;
				runTransactionQuery(query2, connection, function(err, res) {
					if (err) return done(err, false);
					else return done(null, true);
				});
			});
		},
		removeUserMoney: function(connection, userId, quantity, done) {
			var query1 = "SELECT money FROM " + tables.users + " WHERE id=" + escapeString(userId);
			if (!quantity || quantity < 0) return done(new Error("Money quantity not valid"), false);
			runTransactionQuery(query1, connection, function(err, res) {
				if (err) return done(err, false);
				else if (!res || res.length === 0) return done(new Error("User not found"), false);
				if (res[0].money < quantity) return done(new Error("Not enough money"), false);
				var money = res[0].money - quantity;
				var query2 = "UPDATE " + tables.users + " SET money=" + money + " WHERE id=" + userId;
				runTransactionQuery(query2, connection, function(err, res) {
					if (err) return done(err, false);
					else return done(null, true);
				});
			});
		},
		addShipProduct: function(connection, shipId, productId, quantity, done) {
			var query = "SELECT quantity FROM " + tables.shipProducts + " where shipId=" + shipId + " ";
			if (!quantity || quantity < 0) return done(new Error("Product quantity not valid"), false);
			runTransactionQuery(query, connection, function(err, res) {
				var query2;
				if (err) return done(err, false);
				else if (!res || res.length === 0) query2 = "INSERT INTO " + tables.shipProducts + "(shipId,productId,quantity) VALUES(" + escapeString(shipId) + "," + escapeString(productId) + "," + escapeString(quantity) + ")";
				else {
					var productQuantity = res[0].quantity + quantity;
					query2 = "UPDATE " + tables.shipProducts + " SET quantity=" + productQuantity;
				}
				runTransactionQuery(query2, connection, function(err, res) {
					if (err) return done(err, false);
					else return done(null, true);
				});
			});
		},
		removeShipProduct: function(connection, shipId, productId, quantity, done) {
			var query = "SELECT quantity FROM " + tables.shipProducts + " where shipId=" + shipId + " ";
			if (!quantity || quantity < 0) return done(new Error("Product quantity not valid"), false);
			runTransactionQuery(query, connection, function(err, res) {
				var query2;
				if (err) return done(err, false);
				else if (!res || res.length === 0) return done(new Error("Not product to remove"),false);
				else if(res[0].quantity<quantity) return done(new Error("Not enough quantity to remove"));
				else {
					var productQuantity = res[0].quantity - quantity;
					query2 = "UPDATE " + tables.shipProducts + " SET quantity=" + productQuantity;
				
				runTransactionQuery(query2, connection, function(err, res) {
					if (err) return done(err, false);
					else return done(null, true);
				});
			}
			});
		},
		addCityProduct: function(connection, cityId, productId, quantity, done) {

		},
		removeCityProduct: function(connection, cityId, productId, quantity, done) {

		}
	}
};
