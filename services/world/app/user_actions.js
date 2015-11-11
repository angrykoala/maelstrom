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
			console.log(res);
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
							if (res.nModified === 1) done(err, true);
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
