/*
Name: Game Logic
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Game logic
*/
var config = require('../config/config');

module.exports = {
	buyingPrice: function(cityQuantity, production, consumption, basePrice, quantity) {
		return basePrice * quantity * config.buyRatio;
	},
	sellingPrice: function(cityQuantity, production, consumption, basePrice, quantity) {
		return basePrice * quantity * config.sellRatio;
	}
};