/*
Name: World Server
Project: Mäelstrom - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Game server to handle maelstrom dynamic world and game logic
*/

//Game loop example
var gameUpdate = require('./app/game_update');
var Get = require('./app/get_actions');
var data = require('./config/populate');
var assert = require('chai').assert;
var dbHandler = require('./app/dbhandler');
var async = require('async');
var util = require('util');

var nticks = 0;
var populate = new data();

function stopGame() {
	gameUpdate.cancelLoop();
	console.log("Game Stop at tick " + nticks);
}

function logData(done) {
	var dat = {};
	Get.shipModels(function(err, res) {
		assert.notOk(err);
		dat.shipModels = res;
		Get.productList(function(err, res) {
			assert.notOk(err);
			dat.products = res;
			Get.map(function(err, res) {
				assert.notOk(err);
				dat.cities = [];
				async.each(res, function(city, callback) {
					var cityId = city.id;
					Get.cityDetails(cityId, function(err, res) {
						assert.notOk(err);
						dat.cities.push(res);
						callback();
					});
				}, function(err) {
					assert.notOk(err);
					done(dat);
				});
			});
		});
	});
}


populate.populate(function(err) {
	assert.notOk(err);
	gameUpdate.beginLoop(1000, function(err) {
		console.log("tick:" + nticks);
		assert.notOk(err);
		logData(function(res) {
			console.log("LOG - " + nticks);
			console.log(util.inspect(res, {
				showHidden: false,
				depth: null
			}));
		});
		if (nticks > 50) stopGame();
		nticks++;
	});
});