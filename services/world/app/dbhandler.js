/*
Name: Database Handler
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Handler for world database
*/

//var knex = require('knex')(config.connection);
var mysql = require('mysql');
var async = require('async');
var config = require('../config/database.js');
var Models = require('../config/models.js');
var tables = config.tables;
var pool = mysql.createPool(config.connection);


function runQuery(query, done) {
	pool.getConnection(function(err, connection) {
		if (err) {
			connection.release();
			return done(new Error("Error connection database"));
		}
		connection.query(query, function(err, rows) {
			connection.release();
			done(err, rows);
		});
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
	close: function(done) {
		connection.end(done);
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
			var query = "SELECT * FROM " + tables.userShips + " WHERE user_id=" + escapeString(userId);
			runQuery(query, done);
		},
		shipDetails: function(userId, shipId, done) {
			var query = "SELECT * FROM " + tables.userShips + " WHERE id=" + escapeString(shipId);
			runQuery(query, done);
		},
		shipProducts: function(shipId, done) {
			var query = "SELECT * FROM " + tables.shipProducts + " WHERE ship_id=" + escapeString(shipId);
			runQuery(query, done);
		},
		cityProducts: function(cityId, done) {
			var query = "SELECT * FROM " + tables.cityProducts + " WHERE city_id=" + escapeString(cityId);
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
			if (!cityData || !cityData.name || cityData.position_x === undefined || cityData.position_y === undefined) return done(new Error("Not city data"));
			var query = "INSERT INTO " + tables.cities + " (name,position_x,position_y) VALUES(" + escapeString(cityData.name) + "," + escapeString(cityData.position_x) + "," + escapeString(cityData.position_y) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, res.insertId);
			});
		},
		product: function(productData, done) {
			if (!productData || !productData.name || productData.basePrice === undefined || productData.baseConsumption === undefined || productData.baseProduction === undefined || productData.weight === undefined) return done(new Error("Not product data"));
			var query = "INSERT INTO " + tables.products + " (name,base_price,base_production,base_consumption,weight) VALUES(" + escapeString(productData.name) + "," + escapeString(productData.basePrice) + "," + escapeString(productData.baseProduction) + "," + escapeString(productData.baseConsumption) + "," + escapeString(productData.weight) + ")";
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
			var query = "INSERT INTO " + tables.userShips + " (user_id,name,model,life,status) VALUES(" + escapeString(userId) + "," + escapeString(shipData.name) + "," + escapeString(shipData.model) + "," + escapeString(shipData.life) + "," + escapeString(shipData.status) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, res.insertId);
			});
		},
		shipProduct: function(shipId, productId, productData, done) {
			if (shipId === undefined || productId === undefined || !productData) return done(new Error("No product ship data"));
			var query = "INSERT INTO " + tables.shipProducts + " (ship_id,product_id,quantity) VALUES(" + escapeString(shipId) + "," + escapeString(productId) + "," + escapeString(productData.quantity) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, [shipId, productId]);
			});
		},
		cityProduct: function(cityId, productId, productData, done) {
			if (cityId===undefined || productId===undefined || !productData) return done(new Error("No City product data"));
			var query = "INSERT INTO " + tables.cityProducts + " (city_id,product_id,quantity) VALUES (" + escapeString(cityId) + "," + escapeString(productId) + "," + escapeString(productData.quantity) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, [cityId, productId]);
			});
		}
	}
};
