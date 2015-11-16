/*
Name: Database Handler
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Handler for world database
*/

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

module.exports = {
	models: {
		City: require('./models/city.js'),
		Product: require('./models/product.js'),
		User: require('./models/user.js'),
		Ship: require('./models/ship.js')
	},
	getShip: function(userId, shipId, done) {
		this.models.User.findOne(userId, {
			ships: {
				$elemMatch: {
					_id: shipId
				}
			}
		}, function(err, res) {
			if (!res) done(err, null);
			else if (!res.ships) done(err, null);
			else done(err, res.ships[0]);
		});
	},
	/*updateShip: function(userId, shipId, changes, done) {
		this.models.User.update({_id: userId,'ships._id':shipId},{$set:{'ships.$.'+key:value}},function(err,res){
			if(res.nModified===1) done(err,true);
			else done(err,false);	
		});
	},*/
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
	}
};
