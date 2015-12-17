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
	shipUpdate: function(done) {


	}







};