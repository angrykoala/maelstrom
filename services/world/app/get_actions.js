/*
Name: GET Actions
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Actions in  world (API) to get info
*/

var dbHandler = require('./dbhandler.js');
var tables = dbHandler.tables;

//Maybe use some enum to handle the level of info to get
module.exports = {
	//returns all the map basic information
	map: function(done) {
		dbHandler.get.all(tables.cities, done);
	},
	//returns information of certain city
	cityDetails: function(cityId, done) {
		dbHandler.get.byId(tables.cities, cityId, function(err, res) {
			if (err) return done(err, null);
			else if (!res || res.length === 0) return done(new Error("City not found"), null);
			var cityDetails = res[0];
			dbHandler.get.cityProducts(cityId, function(err, res) {
				if (err) return done(err, cityDetails);
				cityDetails.products = res;
				done(null, cityDetails);
			});
		});
	},
	//return city products information of a city
	cityProducts: function(cityId, done) {
		dbHandler.get.cityProducts(cityId, done);
	},
	//returns all user data (money)
	userData: function(userId, done) {
		dbHandler.get.byId(tables.users, userId, function(err, res) {
			if (err) return done(err, null);
			else if (!res || res.length === 0) return done(new Error("User not found"), null);
			else return done(null, res[0]);

		});
	},
	//returns all userId ships basic info 
	ships: function(userId, done) {
		dbHandler.get.userShips(userId, done);
	},
	shipProducts: function(shipId, done) {
		dbHandler.get.shipProducts(shipId, done);
	},
	//returns details of a certain ship
	shipDetails: function(shipId, done) {
		dbHandler.get.shipDetails(shipId, function(err, res) {
			if (err || !res) return done(err, res);
			var shipDetails = res;
			dbHandler.get.shipProducts(shipId, function(err, res) {
				if (err || !res) return done(err, shipDetails);
				shipDetails.products = res;
				done(null, shipDetails);
			});
		});
	},
	//return all ships models
	shipModels: function(done) {
		dbHandler.get.all(tables.shipModels, done);
	},
	productList: function(done) {
		dbHandler.get.all(tables.products, done);
	},
	productDetails: function(productId, done) {
		dbHandler.get.byId(tables.products, productId, function(err, res) {
			if (err) return done(err, res);
			else if (!res || res.length === 0) return done(new Error("Product not found"), null);
			else return done(null, res[0]);

		});
	},
	distance: function(from, to, done) {
		dbHandler.get.byId(tables.cities, from, function(err, res) {
			if (err) done(err);
			else if (!res || res.length === 0) return done(new Error("From city not found"));
			var x1 = res[0].positionX;
			var y1 = res[0].positionY;
			dbHandler.get.byId(tables.cities, to, function(err, res) {
				if (err) done(err);
				else if (!res || res.length === 0) return done(new Error("To city not found"));
				var x2 = res[0].positionX;
				var y2 = res[0].positionY;

				var x = x2 - x1;
				var y = y2 - y1;
				var distance = Math.sqrt(x * x + y * y);
				done(null, distance);
			});
		});
	},
	remainingTime: function(userId, shipId, done) {
		return done(new Error("Not implemented"));
	},
	sellingPrice: function(cityId, productId, quantity, done) {
		//TODO: improve
		dbHandler.get.cityProduct(cityId, productId, function(err, res) {
			if (err) return done(err);
			if (!res || res.length === 0) return done(new Error("Not city-product found"));
			dbHandler.get.byId(tables.products, productId, function(err, res) {
				if (err) return done(err);
				if (!res || res.length === 0) return done(new Error("Not product found"));
				var price = res[0].basePrice * quantity * 0.8;
				return done(null, price);
			});
		});
	},
	buyingPrice: function(cityId, productId, quantity, done) {
		//TODO: improve
		dbHandler.get.cityProduct(cityId, productId, function(err, res) {
			if (err) return done(err);
			if (!res || res.length === 0) return done(new Error("Not city-product found"));
			dbHandler.get.byId(tables.products, productId, function(err, res) {
				if (err) return done(err);
				if (!res || res.length === 0) return done(new Error("Not product found"));
				var price = res[0].basePrice * quantity * 1.2;
				return done(null, price);
			});
		});
	},
};