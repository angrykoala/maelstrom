/*
Name: User Actions
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: User actions to perform in the world (API)
*/

var dbHandler = require('./dbhandler.js');
var Models = dbHandler.models;


module.exports = {
	moveShip: function(userId, shipId, toCityId, done) {
		dbHandler.getShip(userId, shipId, function(err, res) {
			if (err || !res) done(err, false);
			else if (res.status === "docked") {
				res.status = "traveling";
				Get.distance(res.city, toCityId, res.speed, function(err, dist) {
					if (err || !remaining) done(err, false);
					else {
						var time = dist / speed;
						res.travelStatus = {
							origin: res.city,
							destiny: toCityId,
							remaining: time
						};
						dbHandler.updateShip(userId, shipId, res, function(err, res) {
							done(err, true);
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
		done(new Error('Not implemented'));
		//TODO

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