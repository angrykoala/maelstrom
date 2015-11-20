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
		connection.query(query, function(err, res) {
			connection.release();
			if (err) return done(new Error(err));
			else return done(null, res);
		});
	});
}

function createTable(name, schema, done) {
	var query = "CREATE TABLE IF NOT EXISTS " + name + "(" + schema + ")";
	runQuery(query, done);
}

module.exports = {
	close: function(done) {
		connection.end(done);
	},
	escapeString: function(string) {
		return mysql.escape(string);
	},
	dropTables: function(done) {
		var query = "DROP TABLE IF EXISTS " + tables.shipProducts + "," + tables.cityProducts + "," + tables.userShips + "," + tables.users + "," + tables.cities + "," + tables.products + "," + tables.shipModels;
		//var query="DROP TABLE IF EXISTS ship_products,city_products,user_ships,users,cities,products,ship_models;";
		runQuery(query, done);
	},
	clearTables: function(done) {

		async.each(Object.keys(tables), function(table, callback) {
				runQuery("TRUNCATE " + table, callback);
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
			var query = "SELECT * FROM " + escapeString(table);
			runQuery(query, done);
		},
		byId: function(table, id, done) {
			var query = "SELECT * FROM " + escapeString(table) + " WHERE id=" + escapeString(id);
			runQuery(query, done);
		},
		userShips: function(userId, done) {
			var query = "SELECT * FROM " + tables.userShips + "WHERE user_id=" + escapeString(userId);
			runQuery(query, done);
		},
		shipDetails: function(userId, shipId, done) {
			var query = "SELECT * FROM " + tables.userShips + "WHERE ship_id=" + escapeString(shipId);
			runQuery(query, done);
		},
		shipProducts: function(shipId, done) {
			var query = "SELECT * FROM " + tables.shipProducts + "WHERE ship_id=" + escapeString(shipId);
			runQuery(query, done);
		}
	},
	insert: {
		user: function(userId, userData, done) {
			if (!userID || !userData || !userData.money) return done(new Error("Not user data"), false);
			var query = "INSERT INTO " + tables.users + " (id,money) VALUES (" + escapeString(userId) + "," + escapeString(userData.money) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err, false);
				else return done(null, true);
			});
		},
		city: function(cityData, done) {
			if (!cityData || cityData.name || !cityData.position_x || !cityData.position_y) return done(new Error("Not city data"), false);
			var query = "INSERT INTO " + tables.cities + " (name,position_x,position_y) VALUES(" + escapeString(cityData.name) + "," + escapeString(cityData.position_x) + "," + escapeString(cityData.position_y) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err, false);
				else return done(null, true);
			});
		},
		product: function(productData, done) {
			if (!productData || !productData.name || !productData.base_price || !productData.base_consumption || !productData.weigth) return done(new Error("Not product data"), false);
			var query = "INSERT INTO " + tables.products + " (name,base_price,base_consumption,weigth) VALUES(" + productData.name + "," + productData.base_price + "," + productData.base_consumption + "," + productData.weigth + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err, false);
				else return done(null, true);
			});
		},
		shipModel: function(shipData, done) {
			if (!shipData || !shipData.name || !shipData.life || !shipData.speed || !shipData.price || !shipData.cargo)
				return done(new Error("No ShipModel data"), false);

			var query = "INSERT INTO " + tables.shipModels + " (name,life,speed,price,cargo) VALUES(" + shipData.name + "," + shipData.life + "," + shipData.speed + "," + shipData.price + "," + shipData.cargo + ")";

			runQuery(query, function(err, res) {
				if (err || !res) return done(err, false);
				else return done(null, true);
			});
		},
		userShip: function(userId, shipData) {
			if (!userId || !shipData || !shipData.name || !shipData.model || !shipData.life) return done(new Error("No user ship data"), false);
			var query = "INSERT INTO " + tables.userShips + " (user_id,name,model,life) VALUES(" + userId + "," + shipData.name + "," + shipData.model + "," + shipData.life + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err, false);
				else return done(null, true);
			});
		},
		shipProduct: function(shipId, productId, productData, done) {
			if (!shipId || !productId || !productData || productData.quantity) return done(new Error("No product ship data"), false);
			var query = "INSERT INTO " + tables.shipProducts + " (ship_id,product_id,quantity) VALUES(" + shipId + "," + productId + "," + productData.quantity + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err, false);
				else return done(null, true);
			});
		},
		cityProduct: function(cityId, productId, productData, done) {
			if (!cityId || !productId || !productData || !productData.quantity) return done(new Error("No City product data"), false);
			var query = "INSERT INTO " + tables.cityProducts + " (city_id,product_id,quantity) VALUES (" + cityId + "," + productId + "," + productData.quantity + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err, false);
				else return done(null, true);
			});
		}
	}

	/*	
		
		
		
		
		getShip: function(userId, shipId, done) {
			this.models.User.findOne(userId, {
				ships: {
					$elemMatch: {
						_id: shipId
					}
				}
			}, function(err, res) {
		function(err){
				done(err);
				
			});		if (!res) done(err, null);
				else if (!res.ships) done(err, null);
				else done(err, res.ships[0]);
			});
		},
		/*updateShip: function(userId, shipId, changes, done) {
			this.models.User.update({_id: userId,'ships._id':shipId},{$set:{'ships.$.'+key:value}},function(err,res){
				if(res.nModified===1) done(err,true);
				else done(err,false);	
			});
		},
		addShip: function(userId, ship, done) {
			if (!ship || !ship.name) done(new Error("Not valid ship data"), false);
			else {
				//Check if ship with same name already exists
				this.models.User.findOne(userId, function(err, res) {
					if (err || !res) done(err, false);
					else {
						res.ships.push(ship);
						res.save(function(err, res) {
							if (res) done(err, true);
							else done(err, false);
						});
					}
				});
			}
		},
		getCityProduct: function(cityId, productId, done) {
			this.models.City.findOne({
				_id: cityId
			}, {
				products: {
					$elemMatch: {
						_id: productId
					}
				}
			}, function(err, res) {
				if (!res) done(err, null);
				else if (!res.products) done(err, null);
				else done(err, res.products[0]);
			});
		},
		getShipProduct: function(userId, shipId, productId, done) {
			this.models.User.aggregate([{
					$match: {
						_id: ObjectId(userId)
					}
				}, {
					$unwind: "$ships"
				}, {
					$match: {
						'ships._id': ObjectId(shipId)
					}
				}, {
					$unwind: "$ships.products"
				}, {
					$match: {
						"ships.products.id": ObjectId(productId)
					}
				}, {
					$project: {
						'ships.products': 1
					}
				}

			], function(err, res) {
				if (err || !res) return done(err, res);
				if (!res[0] || !res[0].ships || !res[0].ships.products) return done(null, null);
				done(null, res[0].ships.products);
			});
		},
		removeMoney: function(userId, quantity, done) {
			if (quantity < 0.0) done(new Error("Negative Quantity"), false);
			else {
				this.models.User.findById(userId, function(err, user) {
					if (err) done(err, false);
					else if (!user) done(new Error("User not found"), false);
					else {
						if (user.money < quantity) done(null, false);
						else {
							user.money -= quantity;
							user.save(function(err) {
								if (err) done(err, false);
								else done(null, true);
							});
						}
					}
				});
			}
		},
		addMoney: function(userId, quantity, done) {
			if (quantity < 0.0) done(new Error("Negative Quantity"), false);
			else {
				this.models.User.findById(userId, function(err, user) {
					if (err) done(err, false);
					else if (!user) done(new Error("User not found"), false);
					else {
						user.money += quantity;
						user.save(function(err) {
							if (err) done(err, false);
							else done(null, true);
						});
					}
				});
			}
		},
		isCity: function(cityId, done) {
			this.models.City.count({
				_id: cityId
			}, function(err, count) {
				if (count > 0) done(err, true);
				else done(err, false);
			});
		},
		isProduct: function(productId, done) {
			this.models.Product.count({
				_id: productId
			}, function(err, count) {
				if (count > 0) done(err, true);
				else done(err, false);
			});
		},
		isShipModel: function(shipId, done) {
			this.models.Ship.count({
				_id: shipId
			}, function(err, count) {
				if (count > 0) done(err, true);
				else done(err, false);
			});
		},
		isUser: function(userId, done) {
			this.models.User.count({
				_id: userId
			}, function(err, count) {
				if (count > 0) done(err, true);
				else done(err, false);
			});
		},
		addShipProduct: function(userId, shipId, product, done) {
			if (!product || !product.id) done(new Error("Not valid product"), false);
			if (product.quantity === 0) done(null, true);
			this.models.User.update({
				_id: userId,
				'ships._id': shipId
			}, {
				$addToSet: {
					'ships.$.products': product
				}
			}, function(err, res) {
				if (res.nModified >= 1) return done(err, true);
				else return done(err, false);
			});
		},
		removeShipProduct: function(userId, shipId, productId, done) {
			this.models.User.update({
				_id: userId,
				'ships._id': shipId
			}, {
				$pull: {
					'ships.$.products': {
						id: productId
					}
				}
			}, function(err, res) {
				if (res.nModified >= 1) return done(err, true);
				else return done(err, false);
			});
		},
		addCityProductQuantity: function(cityId, productId, quantity, done) {
			if (quantity < 0) return done(new Error("Quantity not valid"), false);
			this.models.City.update({
				_id: cityId,
				'products._id': productId
			}, {
				$inc: {
					'products.$.quantity': quantity
				}
			}, function(err, res) {
				if (res.nModified > 0) return done(err, true);
				else return done(err, false);
			});
		},
		removeCityProductQuantity: function(cityId, productId, quantity, done) {
			if (quantity < 0) return done(new Error("Quantity not valid"), false);
			var City = this.models.City;
			this.getCityProduct(cityId, productId, function(err, res) {
				if (err || !res) return done(err, false);
				if (res.quantity < quantity) return done(null, false);
				City.update({
					_id: cityId,
					'products._id': productId
				}, {
					$inc: {
						'products.$.quantity': -quantity
					}
				}, function(err, res) {
					if (res.nModified > 0) return done(err, true);
					else return done(err, false);
				});
			});
		}*/
};