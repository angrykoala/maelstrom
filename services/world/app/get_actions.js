/*
Name: GET Actions
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Actions in  world (API) to get info
*/

var Models = require('./dbhandler.js').models;
var dbHandler = require('./dbhandler.js');

//Maybe use some enum to handle the level of info to get
module.exports = {
	//returns all the map basic information
	map: function(done) {
		Models.City.find({}, 'id name position_x position_y', done);
	},
	//returns full information of certain city
	cityDetails: function(cityId, done) {
		Models.City.findOne({
			_id: cityId
		}, function(err, res) {
			done(err, res);
		});
	},
	//returns all user data (money)
	userData: function(userId, done) {
		Models.User.findOne({
			_id: userId
		}, 'money', function(err, res) {
			done(err, res);
		});
	},
	//returns all userId ships basic info 
	ships: function(userId, done) {
		Models.User.findOne({
			_id: userId
		}, 'ships._id ships.name ships.model ships.status ships.travelStatus ships.life', function(err, res) {
			var result = res;
			if (res) result = res.ships;
			done(err, result);
		});
	},
	//returns details of a certain ship
	shipDetails: function(userId, shipId, done) {
		Models.User.findOne({
			_id: userId
		}, {
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
		//Add populate
	},
	//return all ships models
	shipModels: function(done) {
		Models.Ship.find({}, done);
	},
	productList: function(done) {
		Models.Product.find({}, 'name weight', done);
	},
	productDetails: function(productId, done) {
		Models.Product.find({
			_id: productId
		}, 'name weight', function(err, res) {
			done(err, res[0]);
		});
	},
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

	}
};