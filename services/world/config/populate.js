//Data for database

var dbHandler = require('../app/dbhandler');
var async = require('async');

var data = function() {
	this.shipModels = {
		galleon: {
			name: "Galleon",
			life: 1000,
			price: 3500,
			speed: 7.5,
			cargo: 850
		},
		caravel: {
			name: "Caravel",
			life: 100,
			price: 1200,
			speed: 15,
			cargo: 80,
		}
	};
	this.products = {
		beer: {
			name: "Beer",
			basePrice: 76
		},
		meat: {
			name: "Meat",
			basePrice: 175
		},
		grain: {
			name: "Grain",
			basePrice: 30
		},
		bread: {
			name: "Bread",
			basePrice: 65
		},
		skins: {
			name: "Skins",
			basePrice: 225
		}
	};
	var prods = this.products;
	this.cities = {
		london: {
			name: "London",
			positionX: 10,
			positionY: 40,
			products: [{
				id: prods.beer,
				production: 1,
				consumption: 0.8,
				quantity: 100
			}, {
				id: prods.meat,
				production: 0,
				consumption: 0.1,
				quantity: 100
			}, {
				id: prods.grain,
				production: 3,
				consumption: 3.2,
				quantity: 100
			}, {
				id: prods.bread,
				production: 6,
				consumption: 5.5,
				quantity: 100
			}, {
				id: prods.skins,
				production: 1,
				consumption: 1.3,
				quantity: 100
			}]
		},
		lubeck: {
			name: "Lubeck",
			positionX: 250,
			positionY: 50,
			products: [{
				id: prods.beer,
				production: 1,
				consumption: 1.2,
				quantity: 100
			}, {
				id: prods.meat,
				production: 1,
				consumption: 0.8,
				quantity: 100
			}, {
				id: prods.grain,
				production: 4,
				consumption: 3.5,
				quantity: 100
			}, {
				id: prods.bread,
				production: 4,
				consumption: 4,
				quantity: 100
			}, {
				id: prods.skins,
				production: 2.5,
				consumption: 2,
				quantity: 100
			}]
		}
	};
};

function insertShips(shipModels, done) {
	async.forEachOf(shipModels, function(value, key, callback) {
		if (shipModels.hasOwnProperty(key)) {
			dbHandler.insert.shipModel(value, function(err, res) {
				return callback(err);
			});
		} else return callback();
	}, function(err) {
		done(err);
	});
}

function insertProducts(products, done) {
	async.forEachOf(products, function(value, key, callback) {
		if (products.hasOwnProperty(key)) {
			dbHandler.insert.product(value, function(err, res) {
				products[key].id = res; //add id to this.products
				return callback(err);
			});
		} else return callback();
	}, function(err) {
		done(err);
	});
}

function insertCities(cities, done) {
	async.forEachOf(cities, function(value, key, callback) {
		if (cities.hasOwnProperty(key)) {
			dbHandler.insert.city(value, function(err, res) {
				if (err) return callback(err);
				var cityId = res;
				var products = cities[key].products;
				async.each(products, function(prod, callback2) {
					var productId = prod.id.id;
					dbHandler.insert.cityProduct(cityId, productId, prod, callback2);
				}, function(err) {
					return callback(err);
				});
			});
		} else return callback();
	}, function(err) {
		done(err);
	});
}

data.prototype.populate = function(done) {
	dbHandler.dropTables(function(err, res) {
		if (err) return done(err);
		dbHandler.createTables(function(err, res) {
			if (err) return done(err);
			insertShips(this.shipModels, function(err) {
				if (err) return done(err);
				insertProducts(this.products, function(err) {
					if (err) return done(err);
					insertCities(this.cities, function(err) {
						return done(err);
					});
				});
			});
		});
	});
};

module.exports = data;