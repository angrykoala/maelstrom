var assert = require('chai').assert;
var async = require('async');

var data = require('./data');
var dbHandler = require('../../app/dbhandler.js');
var tables = dbHandler.tables;

//auxiliary functions for testing
module.exports = {
	insertData: function(done) {
		var user = data.users.arthur;
		var shipModel = data.ships.galleon;
		var product = data.products.bread;
		var city = data.cities.minasTirith;
		var userShip = data.userShips.blackPearl;

		dbHandler.insert.user(user.id, user, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			dbHandler.insert.shipModel(shipModel, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				var shipModelId = res;
				userShip.model = shipModelId;
				dbHandler.insert.city(city, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					var cityId = res;
					dbHandler.insert.product(product, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						var productId = res;
						dbHandler.insert.userShip(user.id, userShip, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							var userShipId = res;
							dbHandler.insert.cityProduct(cityId, productId, {
								quantity: 100
							}, function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								dbHandler.insert.shipProduct(userShipId, productId, {
									quantity: 10
								}, function(err, res) {
									assert.notOk(err);
									assert.ok(res);
									done();
								});
							});
						});
					});
				});
			});
		});
	}
};