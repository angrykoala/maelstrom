/*
Name: Game Update
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Update logic for game event loop
*/
var dbHandler = require('./dbhandler.js');
var tables = dbHandler.tables;

module.exports = {
	cityProductsUpdate: function(done) {
		var cp = tables.cityProducts;
		var prod = tables.products;
		var query = "UPDATE " + cp + "," + prod + " SET " + cp + ".quantity=" + cp + ".quantity+" + prod + ".baseProduction-" + prod + ".baseConsumption WHERE " + cp + ".productId=" + prod + ".id";
		dbHandler.runQuery(query, function(err, res) {
			if (err) return done(new Error("Error on City Product Update"), false);
			else return done(null, true);

		});
	},
	shipsUpdate: function(done) {
		var us = tables.userShips;
		var query = "UPDATE " + us + " SET remaining=" + us + ".remaining-1" + " WHERE status=\"sailing\"";
		var query2 = "UPDATE " + us + " SET city=" + us + ".destiny, status=\"docked\"" + " WHERE remaining=\"0\"";
		dbHandler.beginTransaction(function(err, connection) {
			if (err) return done(err);
			dbHandler.runTransactionQuery(query, connection, function(err, res) {
				if (err) {
					dbHandler.cancelTransaction(connection, function() {
						return done(new Error("Error in Update 1"), false);
					});
				} else dbHandler.runTransactionQuery(query2, connection, function(err, res) {
					if (err) {
						dbHandler.cancelTransaction(connection, function() {
							return done(new Error("Error in Update 2"), false);
						});
					} else {
						dbHandler.commitTransaction(connection, function(err) {
							if (err) return done(err, false);
							else return done(null, true);
						});
					}
				});
			});
		});
	}







};