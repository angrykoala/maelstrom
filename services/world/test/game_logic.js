/*
Name: Game Logic - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for game logic
*/

var assert = require('chai').assert;

var logic = require('../app/game_logic');
var config = require('../config/config');

describe('Game Logic', function() {
	this.timeout(2000);

	it('Buying Price', function() {
		var price = logic.buyingPrice(10, 2, 2, 10, 2);
		assert.strictEqual(price, 10 * 2 * config.buyRatio);
	});
	it('Selling Price', function() {
		var price = logic.sellingPrice(10, 2, 2, 10, 2);
		assert.strictEqual(price, 10 * 2 * config.sellRatio);
	});
});