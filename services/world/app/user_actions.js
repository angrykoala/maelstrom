/*
Name: User Actions
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: User actions to perform in the world (API)
*/

var Models = require('./dbhandler.js').models;

module.exports = {
	moveShip: function(userId, shipId, toCityId, done) {


	},
	buyProduct: function(userId, shipId, cityId, productId, quantity, done) {


	},
	sellProduct: function(userId, shipId, cityId, productId, quantityId, done) {


	},
	buildShip: function(userId, shipModelId, cityId, shipName, done) {


	},
	sellShip: function(userId, shipId, done) {


	},
	repairShip: function(userId, shipId, done) {

	},
	//calls ship to return from journey
	returnShip: function(userId, shipId, done) {


	}
};