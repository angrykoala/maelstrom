/*
Name: GET Actions
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Actions in  world (API) to get info
*/

var dbHandler = require('./dbhandler.js');
var tables = require('../config/database.js');

//Maybe use some enum to handle the level of info to get
module.exports = {
	//returns all the map basic information
	map: function(done) {
		dbHandler.getAll(tables.cities, done);
	},
	//returns full information of certain city
	cityDetails: function(cityId, done) {
		dbHandler.getById(tables.cities, cityId, done);
	},
	//returns all user data (money)
	userData: function(userId, done) {
		dbHandler.getById(tables.users, userId, done);
	},
	//returns all userId ships basic info 
	ships: function(userId, done) {
		dbHandler.getUserShips(userId, done);
	},
	//returns details of a certain ship
	shipDetails: function(shipId, done) {
		dbHandler.getShipDetails(shipId, function(err, res) {
			if (err || !res) return done(err, res);
			dbHandler.getShipProduct(shipId, function(err, res) {
				//return all data in one object

			});
		});
	},
	//return all ships models
	shipModels: function(done) {
		dbHandler.getAll(tables.shipModels, done);
	},
	productList: function(done) {
		dbHandler.getAll(tables.products, done);
	},
	productDetails: function(productId, done) {
		dbHandler.getById(tables.products, productId, done);
	},
	/*
	distance: function(from, to, done) {
		Models.City.findOne({
			_id: from
		}, function(err, res) {
			if (err) done(err);
			else if (!res) done(new Error("From not found"));
			else {
				var x1 = res.position_x;
				var y1 = res.position_y;
				Models.City.findOne({
					_id: to
				}, function(err, res) {
					if (err) done(err);
					else if (!res) done(new Error("From not found"));
					else {
						var x2 = res.position_x;
						var y2 = res.position_y;
						var x = x2 - x1;
						var y = y2 - y1;
						var distance = Math.sqrt(x * x + y * y);
						done(null, distance);
					}
				});
			}
		});
	},
	remainingTime: function(userId, shipId, done) {
		dbHandler.getShip(userId, shipId, function(err, res) {
			if (err) done(err, null);
			else if (!res) done(new Error("Not ship found"), null);
			else if (res.status != "traveling" && res.status != "returning") done(new Error("Ship not traveling"), null);
			else if (!res.travelStatus) done(new Error("Not travel status in ship"), null);
			else {
				done(null, res.travelStatus.remaining);
			}
		});
	},
	getSellingPrice: function(cityId, productId, quantity, done) {
		//TODO: improve
		dbHandler.getCityProduct(cityId, productId, function(err, res) {
			if (err) return done(err);
			if (!res) return done(new Error("Not city-product found"));
			this.productDetails(productId, function(err, res) {
				if (err) return done(err);
				if (!res) return done(new Error("Not product found"));
				var price = res.basePrice * quantity * 0.8;
				return done(null, price);
			});
		});
	},
	getBuyingPrice: function(CityId, productId, quantity, done) {
		//TODO: improve
		dbHandler.getCityProduct(cityId, productId, function(err, res) {
			if (err) return done(err);
			if (!res) return done(new Error("Not city-product found"));
			this.productDetails(productId, function(err, res) {
				if (err) return done(err);
				if (!res) return done(new Error("Not product found"));
				var price = res.basePrice * quantity;
				return done(null, price);
			});
		});
	}*/
};