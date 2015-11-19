/*
Name: User  Actions - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for actions
*/

var assert = require('chai').assert;
var mongoose = require('mongoose');
//var async = require('async');
/*
var auxFunc = require('./config/functions.js');
var data = require('./config/data.js');
//var regexp = require('../config/database.js').regexp;
var Models = require('../app/dbhandler.js').models;

var Actions = require('../app/user_actions.js');
var dbHandler = require('../app/dbhandler.js');*/


describe('User Actions', function() {
	this.timeout(2000);

	before(function(done) {
		db = auxFunc.connectDB(function(err) {
			assert.notOk(err);
			auxFunc.clearDB(function(err) {
				assert.notOk(err);
				auxFunc.insertAllData(function(err) {
					assert.notOk(err);
					done();
				});
			});
		});
	});
	//if data is changed
	beforeEach(function(done) {
		auxFunc.clearDB(function(err) {
			assert.notOk(err);
			auxFunc.insertAllData(function(err) {
				assert.notOk(err);
				done();
			});
		});
	});
	after(function(done) {
		auxFunc.clearDB(function(err) {
			assert.notOk(err);
			db.close(done);
		});
	});

	it("Move Ship", function(done) {
		var userId = data.users.arthur._id;
		cityName1 = data.cities.isengard.name;
		cityName2 = data.cities.minasTirith.name;
		Models.City.find([{
			name: cityName1
		}, {
			name: cityName2
		}], function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.strictEqual(res.length, 2);

			var cityId1 = res[0].id;
			var cityId2 = res[1].id;
			var newShip = {
				name: "Flying Dutchman",
				model: mongoose.Types.ObjectId(),
				life: 310,
				speed: 15,
				products: [],
				city: cityId1
			};
			dbHandler.addShip(userId, newShip, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				Models.User.findOne({
					_id: userId
				}, {
					ships: {
						$elemMatch: {
							name: newShip.name
						}
					}
				}, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					var shipId = res.ships[0].id;
					assert.ok(shipId);

					var newTravelStatus = {
						origin: mongoose.Types.ObjectId(),
						destiny: mongoose.Types.ObjectId(),
						remaining: 5.5
					};

					Actions.moveShip(userId, shipId, cityId2, function(err, res) {
						assert.notOk(err);
						assert.ok(res);
						assert.strictEqual(res, true);
						dbHandler.getShip(userId, shipId, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.equal(res.id, shipId);
							assert.ok(res.travelStatus);
							assert.equal(res.travelStatus.origin, cityId1);
							assert.equal(res.travelStatus.destiny, cityId2);
							assert.strictEqual(res.status, "traveling");
							assert.closeTo(res.travelStatus.remaining, 299.8753 / res.speed, 0.0001); //values (10,40) and (-5,-259.5)
							done();
						});
					});
				});
			});
		});
	});
	it.skip("Buy Product", function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it.skip("Sell Product", function(done) {
		userId = data.users.ohCaptainMyCaptain._id;
		Models.User.findById(userId, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var shipId = res.ships[0].id;
			var product = res.ships[0].products[0];
			var productId = product.id;
			assert.ok(shipId);
			assert.ok(product);
			assert.ok(productId);
			console.log(product);
			Actions.sellProduct(userId, shipId, mongoose.Types.ObjectId(), productId, 5, function(err, res) {
				console.log(err);
				console.log(res);
				Models.User.findById(userId, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					var product = res.ships[0].products;
					console.log(product);
					done();
				});
			});
		});
	});
	it("Build Ship", function(done) {
		var userOrig = data.users.ohCaptainMyCaptain;
		var userId = userOrig._id;
		Models.City.find({}, function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			var cityId = res[0].id;
			assert.ok(cityId);
			Models.Ship.findOne({
				name: data.ships.galleon.name
			}, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				var shipModelId = res.id;
				var shipModel = res;
				assert.ok(shipModelId);
				Actions.buildShip(userId, shipModelId, cityId, "My new ship", function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res, true);
					Models.User.findOne({
						_id: userId
					}, function(err, res) {
						assert.notOk(err);
						assert.strictEqual(res.money, userOrig.money - shipModel.price);
						assert.strictEqual(res.ships.length, userOrig.ships.length + 1);
						var newShip = res.ships[res.ships.length - 1];
						assert.ok(newShip._id);
						assert.strictEqual(newShip.name, "My new ship");
						assert.equal(newShip.model, shipModelId);
						assert.strictEqual(newShip.status, "docked");
						assert.ok(newShip.travelStatus);
						assert.strictEqual(newShip.life, shipModel.life);
						assert.strictEqual(newShip.speed, shipModel.speed);
						assert.equal(newShip.city, cityId);
						Actions.buildShip(userId, shipModelId, cityId, "My new ship2", function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res, false);
							Actions.buildShip(mongoose.Types.ObjectId(), shipModelId, cityId, "My new ship2", function(err, res) {
								assert.ok(err);
								assert.strictEqual(res, false);
								Actions.buildShip(userId, mongoose.Types.ObjectId(), cityId, "My new ship2", function(err, res) {
									assert.ok(err);
									assert.strictEqual(res, false);
									Actions.buildShip(userId, shipModelId, mongoose.Types.ObjectId(), "My new ship2", function(err, res) {
										assert.ok(err);
										assert.strictEqual(res, false);
										done();
									});
								});
							});
						});
					});
				});
			});
		});
	});
	it.skip("Sell Ship", function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it.skip("Repair Ship", function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it.skip("Return Ship", function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
});
