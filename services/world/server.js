/*
Name: World Server
Project: Mäelstrom - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Game server to handle maelstrom dynamic world and game logic
*/

//Game loop example
var gameUpdate = require('./app/game_update');

var nticks = 0;

function stopGame() {
	gameUpdate.cancelLoop();
	console.log("Game Stop at tick " + nticks);
}

gameUpdate.beginLoop(1000, function(err) {
	console.log("tick:" + nticks);
	if (err) {
		console.log(err);
		stopGame();
	}
	if (nticks > 5) stopGame();
	nticks++;
});
