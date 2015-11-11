/*
Name: User Actions
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: User actions to perform in the world (API)
*/

var dbHandler = require('./dbhandler.js');
var Models = dbHandler.models;
var Get = require('./get_actions.js');

module.exports = {
	moveShip: function(userId, shipId, toCityId, done) {
		dbHandler.getShip(userId, shipId, function(err, res) {
			if (err || !res) done(err, false);
			else if (res.status === "docked") {
				Get.distance(res.city, toCityId, function(err, dist) {
					if (err || !dist) done(err, false);
					else {
						var time = dist / res.speed;
						var newTravelStatus = {
							origin: res.city,
							destiny: toCityId,
							remaining: time
						};
						Models.User.update({
							_id: userId,
							'ships._id': shipId
						}, {
							$set: {
								'ships.$.travelStatus': newTravelStatus,
								'ships.$.status': "traveling"
							}
						}, function(err, res) {
							if (res.n === 1) done(err, true); //using n instead of nModified due to travis error
							else done(err, false);
						});
					}
				});
			} else done(null, false);
		});
	},
	buyProduct: function(userId, shipId, cityId, productId, quantity, done) {
		done(new Error('Not implemented'));
		//TODO

	},
	sellProduct: function(userId, shipId, cityId, productId, quantityId, done) {
		done(new Error('Not implemented'));
		//TODO

	},
	buildShip: function(userId, shipModelId, cityId, shipName, done) {
		dbHandler.isCity(cityId, function(err, res) {
			if (err) done(err, false);
			else if (!res) done(new Error("Not valid city id"), false);
			else {
				Models.Ship.findOne({
					_id: shipModelId
				}, function(err, res) {
					if (err) done(err, false);
					else if (!res) done(new Error("Not valid ship model"), false);
					else {
						var shipModel = res;
						dbHandler.removeMoney(userId, shipModel.price, function(err, res) {
							if (err || !res) done(err, false);
							else {
								var newShip = {
									name: shipName,
									life: shipModel.life,
									speed: shipModel.speed,
									products: [],
									status: "docked",
									city: cityId,
									model: shipModel,
									travelStatus: {
										origin: null,
										destiny: null,
										remaining: 0.0
									}
								};
								dbHandler.addShip(userId, newShip, function(err, res) {
									done(err, res);
								});
							}
						});
					}
				});
			}
		});
	},
	sellShip: function(userId, shipId, done) {
		done(new Error('Not implemented'));
		//TODO

	},
	repairShip: function(userId, shipId, done) {
		done(new Error('Not implemented'));
		//TODO
	},
	//calls ship to return from journey
	returnShip: function(userId, shipId, done) {
		done(new Error('Not implemented'));
		//TODO
	}
};