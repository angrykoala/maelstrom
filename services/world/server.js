/*
Name: World Server
Project: Mäelstrom - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Game server to handle maelstrom dynamic world and game logic
*/

//Game loop example
var gameUpdate = require('./app/game_update');
var Get = require('./app/get_actions');
var conf = require('./test/config/functions');
var assert = require('chai').assert;
var dbHandler = require('./app/dbhandler');

var nticks = 0;

function stopGame() {
	gameUpdate.cancelLoop();
	console.log("Game Stop at tick " + nticks);
}

function prepareDatabase(done) {
	dbHandler.dropTables(function(err, res) {
		assert.notOk(err);
		dbHandler.createTables(function(err, res) {
			assert.notOk(err);
			dbHandler.clearTables(function(err) {
				assert.notOk(err);
				conf.populate(done);
			});
		});
	});
}

prepareDatabase(function(err) {
	assert.notOk(err);
	Get.map(function(err, res) {
		assert.notOk(err);
		var cityId = res[0].id;

		gameUpdate.beginLoop(1000, function(err) {
			console.log("tick:" + nticks);
			Get.cityProducts(cityId, function(err, res) {
				assert.notOk(err);
				console.log(res);
			});
			assert.notOk(err);
			if (nticks > 5) stopGame();
			nticks++;
		});
	});
});