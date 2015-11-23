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
			else if(!res || res.length===0) return done(new Error("City not found"),null);
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
		dbHandler.get.byId(tables.users, userId, function(err,res){
			if(err) return done(err,null);
			else if(!res || res.length===0) return done(new Error("User not found"),null);
			else return done(null,res[0]);
			
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
		dbHandler.get.byId(tables.products, productId, done);
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
