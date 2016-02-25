/*
Name: Database Handler
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Handler for world database
*/

var mysql = require('mysql');
var async = require('async');
var config = require('../config/database');
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
		if (err) return done(err);
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
	escapeString: escapeString,
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
    runTransactionQuery: runTransactionQuery,
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
	cancelTransaction: function(connection, done) {
		connection.rollback(function() {
			connection.release();
			done();
		});
	},
	dropTables: function(done) {
		var query = "DROP TABLE IF EXISTS " + tables.shipProducts + "," + tables.cityProducts + "," + tables.userShips + "," + tables.users + "," + tables.cities + "," + tables.products + "," + tables.shipModels;
		//var query="DROP TABLE IF EXISTS ship_products,city_products,user_ships,users,cities,products,ship_models;";
		runQuery(query, done);
	},
	get: {
		all: function(table, done) {
			var query = "SELECT * FROM " + table;
			runQuery(query, done);
		},
		byId: function(table, id, done) {
			var query = "SELECT * FROM " + table + " WHERE id=" + escapeString(id);
			runQuery(query, done);
		}
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
	}
};
